const user = require('./data');
const FakeProvider = require('./FakeProvider');
const Observer = require('./Observer');

const { countAverage, deepCopy } = require('./utils');

const [PRICE_CHANGE, CHECK, OTHER_CHECK, TRADING_OPERATION, BUY, SELL, COVER] = ['PRICE_CHANGE', 'CHECK', 'OTHER_CHECK', 'TRADING_OPERATION', 'BUY', 'SELL', 'COVER'];

// 启动观察者模式
const observer = Observer();

const handler = {
  datumPrice: undefined,

  sellPrice: undefined,
  dsPrice: undefined,
  coverPrice: undefined,
  dcPrice: undefined,

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

  handlerBuy: (msg) => {
    let { newPrice, rule } = msg.args;
    if (typeof handler.datumPrice === 'undefined') {
      handler.datumPrice = newPrice;
    }

    let currentRate = 1 - newPrice / handler.datumPrice;
    if (currentRate >= rule.condition.buy_in.rate) {
      if (rule.condition.buy_in.retracement === 0) {
        observer.fire(TRADING_OPERATION, { type: BUY, price: newPrice });
      } else {
        handler.datumPrice = newPrice;
        // 移除旧订阅，发布新订阅
        observer.remove(CHECK, handler.handlerBuy);
        observer.regist(CHECK, handler.handlerBuyRetrace);
        console.log('------------------ retracement line of buy --------------------------------')
      }
    }
  },

  handlerBuyRetrace: (msg) => {
    let { newPrice, rule } = msg.args;

    let currentRate = newPrice / handler.datumPrice - 1;
    if (currentRate >= rule.condition.buy_in.retracement) {
      observer.fire(TRADING_OPERATION, { type: BUY, price: newPrice });
      // 移除旧订阅，发布新订阅
      observer.remove(CHECK, handler.handlerBuyRetrace);
      observer.regist(CHECK, handler.handlerBuy);
    }
  },

  handlerSell: (msg) => {
    let { newPrice, rule, hold } = msg.args;

    switch (rule.price.close) {
      /* 均价平仓 */
      case 0: {

        if (typeof handler.sellPrice === 'undefined') {
          handler.sellPrice = countAverage(hold);
          console.log(handler.sellPrice);
        }

        if (typeof handler.dsPrice === 'undefined') {
          let currentRate = newPrice / handler.sellPrice - 1;
          if (currentRate >= rule.condition.sell_out.rate) {
            if (rule.condition.sell_out.retracement === 0) {
              observer.fire(TRADING_OPERATION, { type: SELL, price: newPrice, close: rule.price.close });
            } else {
              handler.dsPrice = newPrice
              console.log('------------------ retracement line of sell --------------------------------')
            }
          }
        } else {
          let currentRate = 1 - newPrice / handler.dsPrice;
          if (currentRate >= rule.condition.sell_out.retracement) {
            observer.fire(TRADING_OPERATION, { type: SELL, price: newPrice, close: rule.price.close });
          }
        }
        break;
      }
      /* 逐单平仓 */
      case 1: {
        hold.forEach((value, index) => {
          if (typeof value.dsPrice === 'undefined') {
            let currentRate = newPrice / value.inPrice - 1;
            if (currentRate >= rule.condition.sell_out.rate) {
              if (rule.condition.sell_out.retracement === 0) {
                observer.fire(TRADING_OPERATION, { type: SELL, price: newPrice, close: rule.price.close, index });
              } else {
                value.dsPrice = newPrice;
                console.log('------------------ retracement line of sell --------------------------------')
              }
            }
          } else {
            let currentRate = 1 - newPrice / value.dsPrice;
            if (currentRate >= rule.condition.sell_out.retracement) {
              observer.fire(TRADING_OPERATION, { type: SELL, price: newPrice, close: rule.price.close, index });
            }
          }
        });
        break;
      }
    }

  },

  handlerCover: (msg) => {
    let { newPrice, rule, hold } = msg.args;
    
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


      if (typeof handler.dcPrice === 'undefined') {
        let currentRate = 1 - newPrice / handler.coverPrice;
        if (currentRate >= rule.condition.cover.rate) {
          if (rule.condition.cover.retracement === 0) {
            observer.fire(TRADING_OPERATION, { type: COVER, price: newPrice });
          } else {
            handler.dcPrice = newPrice;
            console.log('------------------ retracement line of cover --------------------------------')
          }
        }
      } else {
        let currentRate = newPrice / handler.dcPrice - 1;
        if (currentRate >= rule.condition.cover.retracement) {
          observer.fire(TRADING_OPERATION, { type: COVER, price: newPrice });
        }
      }
    }
  },

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
    this.cash = deepCopy(this.rule.cover.amount);
    this.coverTimes = this.rule.cover.times

    /* 私有方法 */
    this.tradingOperation = (msg) => {
      switch (msg.args.type) {
        case BUY: {
          handler.datumPrice = undefined;

          let cash = this.cash[0];
          this.cash.shift();

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

          let cash = this.cash[0];
          this.cash.shift();

          this.hold.push({
            inPrice: msg.args.price,
            amount: cash / msg.args.price,
            dsPrice: undefined,
          });
          console.log('HOLD:', this.hold, '---------COVERED-------------');
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

// main
let listen = new Tactics(user);
listen.start();