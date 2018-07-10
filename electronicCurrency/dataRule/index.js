const [OK, BTC, BNB] = ['ok', 'btc', 'bnb'];

const rule = {
  user: [
    {
      exchange: OK,
      price_currency: BTC,
      underlying_currency: BNB,
      predictive_capital: 1000000,
    }
  ],
  monitor: {
    quantity: 1,  // 监控货币对数量
    duration: 60,  // 监控时长（min）
  },
  cover: {
    /**
     * 补仓类型
     * 0 - 按买入金额
     * 1 - 按补仓次数
     */
    type: 0,
    amount: [100, 200, 300, 400],  // 买入金额
    // type: 1,
    // amount: 100,  // 买入金额
    // times: 5,  // 补仓次数
    // multiple: 0.5,  // 补仓倍率
  },
  condition: {
    /**
     * 买入跌幅 - 回调
     * 卖出涨幅 - 回调
     * 补仓跌幅 - 回调
     */
    buy_in: {
      rate: 0.35,
      retracement: 0.20,
    },
    sell_out: {
      rate: 0.35,
      retracement: 0,
    },
    cover: {
      rate: 0.35,
      retracement: 0,
    },
  },
  price: {
    /**
     * 补仓价格采用
     * 0 - 最后买入价
     * 1 - 当前持仓均价
     */
    cover: 0,
    /**
     * 平仓规则
     * 0 - 均价平仓
     * 1 - 逐单平仓
     */
    close: 0,
    /**
     * 行情价格策略
     * 0 - 交易价优先
     * 1 - 量优先
     */
    strategy: 0
  },
  exception: {
    /**
     * 暴涨应对策略
     */
    rise: {
      duration: 10,  // 监控时间
      rate: 0.15,  // 拉升
      multiple: 0.5,  // 调整买入跌幅（倍）
    },
  },
  abolish: {
    /**
     * 是否撤单
     * 0 - 否
     * 1 - 是
     */
    status: 0,
    timeout: 60,  // 下单超时（sec）
  }
}

class FakeProvider {
  constructor(exchange, priceCurrency, underlyingCurrency) {
    this.exchagne = exchange;
    this.priceCurrency = priceCurrency;
    this.underlyingCurrency = underlyingCurrency;
  }

  start(fn) {
    let data = [6, 5.4, 3.4, 1.2, 1.5, 1.6, 1.8, 2.0, 3.3, 5.5, 6.7, 3.5];
    for (let i = 0; i < data.length; i++) {
      ((j) => {
        setTimeout(() => {
          fn(data[j]);
        }, 500 * j);
      })(i)
    }
  }
}

const [BUY, SELL] = ['buy', 'sell'];

class Tactics {
  constructor(rule) {
    this.rule = rule;
    this.price = [];
  }

  getRule() {
    return this.rule;
  }

  start() {
    const self = this;

    const handleBuyIn = {
      lock: false,

      /**
       * 0 - 不存在回调
       * 1 - 存在而不满足条件回调
       * 2 - 存在且满足条件回调
       */
      isRetrace: self.rule.condition.buy_in.retracement === 0 ? 0 : 1,

      lastValue: 0,  // p1

      newsetValue: 0,  // p3

      retarceValue: 0,  // p2

      money: self.rule.cover.amount,

      hold: [],

      transition: function (event) {
        const { price } = event;
        this.newsetValue = price.length - 1;

        switch (this.isRetrace) {
          case 0: {
            let currentRate = (1 - price[this.newsetValue] / price[this.lastValue]).toFixed(2);

            if (currentRate > self.rule.condition.buy_in.rate) {
              // console.log(currentRate, self.rule.condition.buy_in.rate);
              this.buyIt(price[price.length - 1]);

              event.lastValue = this.lastValue;
            }
            break;
          }
          case 1: {
            let currentRate = (1 - price[this.newsetValue] / price[this.lastValue]).toFixed(2);

            /* 达到跌幅要求 */
            if (currentRate > self.rule.condition.buy_in.rate) {
              this.retarceValue = this.newsetValue;
              this.isRetrace = 2;
              this.lock = true;
            }
            break;
          }
          case 2: {
            let oldFallRate = (1 - price[this.retarceValue] / price[this.lastValue]).toFixed(2);
            let currentRate = (1 - price[this.newsetValue] / price[this.lastValue]).toFixed(2);
            // console.log(oldFallRate, currentRate);

            /* 判断是否持续下跌 */
            if (currentRate > oldFallRate) {
              this.retarceValue = this.newsetValue;
            } else {
              let retarceRate = (price[this.newsetValue] / price[this.retarceValue] - 1).toFixed(2);
              // console.log(retarceRate);
              /* 判断是否满足回调条件 */
              if (retarceRate >= self.rule.condition.buy_in.retracement) {
                this.buyIt(price[price.length - 1]);

                event.lastValue = this.lastValue;
                this.isRetrace = 1;
                this.lock = false;
              }
            }
          }
        }

        event.hold = this.hold;
        return event;
      },

      buyIt: function (price) {
        let count;
        if (this.money instanceof Array) {
          count = this.money[0] / price;
          this.money.shift();
        } else {
          count = this.money / price;
        }

        this.retarceValue = this.lastValue = this.newsetValue;

        this.hold.push({
          count,
          price,
        })

        // do something about buy

        console.log('======X', 'auto buy ' + this.hold.length + ' time(s).');
      },

      update: function (event) {
        if (event.hasOwnProperty('lastValue')) {
          this.lastValue = event.lastValue;
        }
        if (event.hasOwnProperty('hold')) {
          this.hold = event.hold;
        }
      },
    }

    const handleSellOut = {
      lock: false,

      isRetrace: self.rule.condition.sell_out.retracement === 0 ? 0 : 1,

      lastValue: 0,  // p1

      newsetValue: 0,  // p3

      retarceValue: 0,  // p2

      hold: [],

      transition: function (event) {
        const { price } = event;
        this.newsetValue = price.length - 1;

        this.update(event);

        if (this.hold.length == 0) return event;

        switch (this.isRetrace) {
          case 0: {
            let currentRate = (price[this.newsetValue] / price[this.lastValue] - 1).toFixed(2);

            if (currentRate >= self.rule.condition.sell_out.rate) {
              this.sellIt(price[price.length - 1]);
            }
          }
          case 1: {

          }
          case 2: {

          }
        }

        event.hold = this.hold;
        return event;
      },

      sellIt: function (price) {

        // do something about sell

        console.log('======X', 'auto sell ' + this.hold.length + ' time(s).');

        this.hold.shift();

        this.retarceValue = this.lastValue = this.newsetValue;
      },

      update: function (event) {
        if (event.hasOwnProperty('lastValue')) {
          this.lastValue = event.lastValue;
        }
        if (event.hasOwnProperty('hold')) {
          this.hold = event.hold;
        }
      },
    }

    const handleCover = {
      lock: false,

      isRetrace: self.rule.condition.cover.retracement === 0 ? 0 : 1,

      lastValue: 0,

      newsetValue: 0,

      retarceValue: 0,

      transition: function (event) {

      },

      update: function (event) {
        if (event.hasOwnProperty('lastValue')) {
          this.lastValue = event.lastValue;
        }
        if (event.hasOwnProperty('hold')) {
          this.hold = event.hold;
        }
      },
    }

    let provider = new FakeProvider(this.rule.user[0].exchange, this.rule.user[0].price_currency, this.rule.user[0].underlying_currency);
    provider.start((data) => {
      self.price.push(data);
      console.log(self.price);

      let event = {
        price: self.price,
      }

      event = handleBuyIn.transition(event);

      event = handleSellOut.transition(event);

      // console.log("======>", event);
    });
  }
}

// main
let listen = new Tactics(rule);
listen.start();