const [OK, BTC, BNB] = ['ok', 'btc', 'bnb'];

const user = {
  exchange: OK,
  price_currency: BTC,
  underlying_currency: BNB,
  predictive_capital: 1000000,
  rule: {
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
      amount: [100, 200, 100, 200, 100, 200, 100, 200],  // 买入金额
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
        retracement: 0.2,
      },
      sell_out: {
        rate: 0.2,
        retracement: 0.1,
      },
      cover: {
        rate: 0.2,
        retracement: 0.1,
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
      close: 1,
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
}

module.exports = user;