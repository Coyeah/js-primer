const user = require('./data');
const FakeProvider = require('./models/FakeProvider');
const Observer = require('./models/Observer');

const { countAverage, deepCopy, checkRate, checkType } = require('./utils');

const { ACTION, RETRACE, CONTINUE } = checkType;
const [PRICE_CHANGE, CHECK, OTHER_CHECK, TRADING_OPERATION, BUY, SELL, COVER] = ['PRICE_CHANGE', 'CHECK', 'OTHER_CHECK', 'TRADING_OPERATION', 'BUY', 'SELL', 'COVER'];

class Tactics {
  constructor(db, user) {
    this.db = db;
    this.exchange = user.exchange;
    this.priceCurrency = user.price_currency;
    this.underlyingCurrency = user.underlying_currency;
    this.predictiveCapital = user.predictive_capital;
    this.rule = user.rule;

    /*  */
    this.observer = Observer();
    this.handler = {
      handlerDeal: (msg) => {
        let type = msg.args.type || msg.type;
        switch (type) {
          case PRICE_CHANGE: {
            if (msg.args.hold.length === 0) {
              this.observer.fire(CHECK, msg.args);
            } else {
              this.observer.fire(OTHER_CHECK, msg.args);
            }
            break;
          }
        }

      },

      buyPrice: undefined,
      dbPrice: undefined,
      handlerBuy: (msg) => {
        let { newPrice, rule } = msg.args;

        if (typeof this.handler.buyPrice === 'undefined') {
          this.handler.buyPrice = newPrice;
        }

        let key = checkRate({
          type: 1,
          rate: rule.condition.buy_in.rate,
          retracement: rule.condition.buy_in.retracement,
          newPrice,
          retracePrice: this.handler.dbPrice,
          lastPrice: this.handler.buyPrice,
        });

        switch (key.type) {
          case ACTION: {
            this.observer.fire(TRADING_OPERATION, { type: BUY, price: newPrice });
            break;
          }
          case RETRACE: {
            this.handler.dbPrice = newPrice;
            break;
          }
        }
      },

      sellPrice: undefined,
      dsPrice: undefined,
      handlerSell: (msg) => {
        let { newPrice, rule, hold } = msg.args;

        switch (rule.price.close) {
          /* 均价平仓 */
          case 0: {
            if (typeof this.handler.sellPrice === 'undefined') {
              this.handler.sellPrice = countAverage(hold);
            }

            let key = checkRate({
              type: 0,
              rate: rule.condition.sell_out.rate,
              retracement: rule.condition.sell_out.retracement,
              newPrice,
              retracePrice: this.handler.dsPrice,
              lastPrice: this.handler.sellPrice,
            });

            switch (key.type) {
              case ACTION: {
                this.observer.fire(TRADING_OPERATION, { type: SELL, price: newPrice, close: rule.price.close });
                break;
              }
              case RETRACE: {
                this.handler.dsPrice = newPrice;
                break;
              }
            }
            break;
          }
          /* 逐单平仓 */
          case 1: {
            hold.forEach((value, index) => {
              let key = checkRate({
                type: 0,
                rate: rule.condition.sell_out.rate,
                retracement: rule.condition.sell_out.retracement,
                newPrice,
                retracePrice: value.dsPrice,
                lastPrice: value.inPrice,
              });

              switch (key.type) {
                case ACTION: {
                  this.observer.fire(TRADING_OPERATION, { type: SELL, price: newPrice, close: rule.price.close });
                  break;
                }
                case RETRACE: {
                  value.dsPrice = newPrice;
                  break;
                }
              }
            });
            break;
          }
        }
      },

      coverPrice: undefined,
      dcPrice: undefined,
      handlerCover: (msg) => {
        let { newPrice, rule, hold } = msg.args;

        /* 判断持有量 */
        if (hold.length != 0) {
          if (typeof this.handler.coverPrice === 'undefined') {
            switch (rule.price.cover) {
              /* 最后买入价 */
              case 0: {
                this.handler.coverPrice = hold[hold.length - 1].inPrice;
                break;
              }
              /* 当前持仓均价 */
              case 1: {
                this.handler.coverPrice = countAverage(hold);
                break;
              }
            }
          }

          let key = checkRate({
            type: 1,
            rate: rule.condition.cover.rate,
            retracement: rule.condition.cover.retracement,
            newPrice,
            retracePrice: this.handler.dcPrice,
            lastPrice: this.handler.coverPrice,
          });

          switch (key.type) {
            case ACTION: {
              this.observer.fire(TRADING_OPERATION, { type: COVER, price: newPrice });
              break;
            }
            case RETRACE: {
              this.handler.dcPrice = newPrice;
              break;
            }
          }
        }
      },

      handlerRise: (msg) => {

      }
    }

    /* start方法 - 初始化属性 */
    this.price = [];
    this.hold = [];
    this.coTac = {
      amount: deepCopy(this.rule.cover.amount),
      times: this.rule.cover.times,
      multiple: this.rule.cover.multiple,
    }

    /* 私有方法 */
    this.tradingOperation = (msg) => {
      switch (msg.args.type) {
        case BUY: {
          this.handler.buyPrice = this.handler.dbPrice = undefined;

          let cash;
          if (typeof this.coTac.amount === 'number') {
            cash = this.coTac.amount;
          } else {
            cash = this.coTac.amount[0];
            this.coTac.amount.shift();
          }

          this.hold.push({
            inPrice: msg.args.price,
            amount: cash / msg.args.price,
            dsPrice: undefined,
          });
          console.log('HOLD:', this.hold, '---------BOUGHT-------------');
          break;
        }
        case SELL: {
          const { price, close, index } = msg.args
          this.handler.coverPrice = this.handler.dcPrice = this.handler.sellPrice = this.handler.dsPrice = undefined;

          switch (close) {
            case 0: {
              this.hold = [];
              break;
            }
            case 1: {
              this.hold.splice(index, 1);
              break;
            }
          }

          console.log('HOLD:', this.hold, '---------SELLED-------------');
          break;
        }
        case COVER: {
          this.handler.coverPrice = this.handler.dcPrice = this.handler.sellPrice = this.handler.dsPrice = undefined;

          let cash;
          if (typeof this.coTac.amount === 'number') {
            if (this.coTac.multiple !== 0) {
              cash = Math.pow(this.coTac.multiple, (this.rule.cover.times - this.coTac.times + 1)) * this.coTac.amount;
              this.coTac.times -= 1;
            }
          } else {
            if (this.coTac.amount.length !== 0) {
              cash = this.coTac.amount[0];
              this.coTac.amount.shift();
            }
          }
          if (cash) {
            this.hold.push({
              inPrice: msg.args.price,
              amount: cash / msg.args.price,
              dsPrice: undefined,
            });
            console.log('HOLD:', this.hold, '---------COVERED-------------');
          }
          break;
        }
      }
    }
  }

  start() {
    /* 设置初始化监听 */
    this.observer.regist(PRICE_CHANGE, this.handler.handlerDeal);
    this.observer.regist(CHECK, this.handler.handlerBuy);
    this.observer.regist(OTHER_CHECK, this.handler.handlerSell);
    this.observer.regist(OTHER_CHECK, this.handler.handlerCover);
    this.observer.regist(TRADING_OPERATION, this.tradingOperation);

    const self = this;

    this.db.onData((data) => {
      self.price.push(data);
      console.log(self.price[self.price.length - 1]);

      this.observer.fire(PRICE_CHANGE, {
        rule: self.rule,
        newPrice: self.price[self.price.length - 1],
        hold: self.hold,
      })
    })
  }

  getRule() {
    return this.rule;
  }
}

module.exports = Tactics;
