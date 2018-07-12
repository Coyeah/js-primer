const user = require('./data');
const FakeProvider = require('./models/FakeProvider');
const Observer = require('./models/Observer');

const { countAverage, deepCopy, checkRate, checkType } = require('./utils');

const { ACTION, RETRACE, CONTINUE } = checkType;
const [PRICE_CHANGE, CHECK, OTHER_CHECK, TRADING_OPERATION, BUY, SELL, COVER] = ['PRICE_CHANGE', 'CHECK', 'OTHER_CHECK', 'TRADING_OPERATION', 'BUY', 'SELL', 'COVER'];

// 启动观察者模式
const observer = Observer();

const handler = {
  handlerDeal: (msg) => {
    let type = msg.args.type || msg.type;
    switch (type) {
      case PRICE_CHANGE: {
        if (msg.args.hold.length === 0) {
          observer.fire(CHECK, msg.args);
        } else {
          observer.fire(OTHER_CHECK, msg.args);
        }
        break;
      }
    }

  },

  buyPrice: undefined,
  dbPrice: undefined,
  handlerBuy: (msg) => {
    let { newPrice, rule } = msg.args;

    if (typeof handler.buyPrice === 'undefined') {
      handler.buyPrice = newPrice;
    }

    let key = checkRate({
      type: 1,
      rate: rule.condition.buy_in.rate,
      retracement: rule.condition.buy_in.retracement,
      newPrice,
      retracePrice: handler.dbPrice,
      lastPrice: handler.buyPrice,
    });

    switch (key.type) {
      case ACTION: {
        observer.fire(TRADING_OPERATION, { type: BUY, price: newPrice });
        break;
      }
      case RETRACE: {
        handler.dbPrice = newPrice;
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
        if (typeof handler.sellPrice === 'undefined') {
          handler.sellPrice = countAverage(hold);
        }

        let key = checkRate({
          type: 0,
          rate: rule.condition.sell_out.rate,
          retracement: rule.condition.sell_out.retracement,
          newPrice,
          retracePrice: handler.dsPrice,
          lastPrice: handler.sellPrice,
        });

        switch (key.type) {
          case ACTION: {
            observer.fire(TRADING_OPERATION, { type: SELL, price: newPrice, close: rule.price.close });
            break;
          }
          case RETRACE: {
            handler.dsPrice = newPrice;
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
              observer.fire(TRADING_OPERATION, { type: SELL, price: newPrice, close: rule.price.close });
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
      if (typeof handler.coverPrice === 'undefined') {
        switch (rule.price.cover) {
          /* 最后买入价 */
          case 0: {
            handler.coverPrice = hold[hold.length - 1].inPrice;
            break;
          }
          /* 当前持仓均价 */
          case 1: {
            handler.coverPrice = countAverage(hold);
            break;
          }
        }
      }

      let key = checkRate({
        type: 1,
        rate: rule.condition.cover.rate,
        retracement: rule.condition.cover.retracement,
        newPrice,
        retracePrice: handler.dcPrice,
        lastPrice: handler.coverPrice,
      });

      switch (key.type) {
        case ACTION: {
          observer.fire(TRADING_OPERATION, { type: COVER, price: newPrice });
          break;
        }
        case RETRACE: {
          handler.dcPrice = newPrice;
          break;
        }
      }
    }
  },

  handlerRise: (msg) => {

  }
}

class Tactics {
  constructor(user) {
    this.exchange = user.exchange;
    this.priceCurrency = user.price_currency;
    this.underlyingCurrency = user.underlying_currency;
    this.predictiveCapital = user.predictive_capital;
    this.rule = user.rule;

    /* 初始化属性 */
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
          handler.buyPrice = handler.dbPrice = undefined;

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
          handler.coverPrice = handler.dcPrice = handler.sellPrice = handler.dsPrice = undefined;

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
          handler.coverPrice = handler.dcPrice = handler.sellPrice = handler.dsPrice = undefined;

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
    observer.regist(PRICE_CHANGE, handler.handlerDeal);
    observer.regist(CHECK, handler.handlerBuy);
    observer.regist(OTHER_CHECK, handler.handlerSell);
    observer.regist(OTHER_CHECK, handler.handlerCover);
    observer.regist(TRADING_OPERATION, this.tradingOperation);

    const self = this;

    let provider = new FakeProvider(this.exchange, this.priceCurrency, this.underlyingCurrency);
    provider.start((data) => {
      self.price.push(data);
      console.log(self.price);

      observer.fire(PRICE_CHANGE, {
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

// module.exports = Tactics;

// main
let listen = new Tactics(user);
listen.start();
setTimeout(() => {
  let listener = new Tactics(user);
  listener.start();
}, 500);


setInterval(() => {
  console.log(handler);
}, 500);