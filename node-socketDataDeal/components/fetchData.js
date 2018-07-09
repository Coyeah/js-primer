const WebSocket = require('ws');
const moment = require('moment');
const pako = require('pako');

/* Provider */
class Provider {
  constructor(params) {
    this.priceCurrency = params.priceCurrency;
    this.underlyingCurrency = params.underlyingCurrency;
    this.onData = params.onData;
    this.interval = params.interval || 500;
  }
}

/* for OK */
class OKProvider extends Provider {
  constructor(params) {
    super(params);
    this.type = 'OK';
    this.WS_URL = "wss://real.okcoin.com:10440/websocket";
    this.timer = undefined;
  }

  start() {
    const info = [
      {
        'event': 'addChannel',
        'channel': `ok_sub_spot_${this.priceCurrency}_${this.underlyingCurrency}_ticker`
      },
      {
        'event': 'addChannel',
        'channel': `ok_sub_spot_${this.priceCurrency}_${this.underlyingCurrency}_depth_5`
      }
    ];

    const self = this;

    let target = {
      type: this.type,
      priceCurrency: this.priceCurrency,
      underlyingCurrency: this.underlyingCurrency,
      timestamp: null,
      amount: null,
      count: null,
      open: null,
      close: null,
      low: null,
      high: null,
      vol: null,
      deepBids: null,
      deepAsks: null,
    };
    init(info, this.WS_URL, (msg) => {
      // do something
      switch (msg[0].channel) {
        case info[0].channel: {
          for (let key in msg[0].data) {
            switch (key) {
              case 'vol': {
                target.amount = msg[0].data[key];
                break;
              }
              default: {
                if (target.hasOwnProperty(key)) {
                  target[key] = msg[0].data[key];
                }
                break;
              }
            }
          }
          break;
        }
        case info[1].channel: {
          for (let key in msg[0].data) {
            if (target.hasOwnProperty(key)) {
              target[key] = msg[0].data[key];
            } else {
              switch (key) {
                case 'asks': {
                  target.deepAsks = msg[0].data[key];
                  break;
                }
                case 'bids': {
                  target.deepBids = msg[0].data[key];
                  break;
                }
              }
            }
          }
          break;
        }
      }
    });

    function init(info, url, fn) {
      var ws = new WebSocket(url);
      ws.on('open', () => {
        console.log('open');
        subscribe(ws, info);
      });

      ws.on('message', (data) => {
        let msg = JSON.parse(data);
        // console.log(msg);
        fn(msg);
      });

      ws.on('close', () => {
        console.log('close');
        init();
      });

      ws.on('error', err => {
        console.log('error', err);
        init();
      });

      function subscribe(ws, info) {
        ws.send(JSON.stringify(info));
      }

      return ws;
    }

    this.timer = setInterval(() => {
      self.onData(target);
    }, this.interval);
  }

  stop() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
  }

  test() {
    console.log(this.priceCurrency, this.underlyingCurrency);
  }
}

/* for ZB */
class ZBProvider extends Provider {
  constructor(params) {
    super(params)
    this.type = 'ZB';
    this.WS_URL = "wss://api.zb.com:9999/websocket";
    this.timer = undefined;
  }

  start() {
    const info = [
      {
        'event': 'addChannel',
        'channel': `${this.priceCurrency}${this.underlyingCurrency}_ticker`
      },
      {
        'event': 'addChannel',
        'channel': `${this.priceCurrency}${this.underlyingCurrency}_depth`,
      }
    ];

    const self = this;

    let target = {
      type: this.type,
      priceCurrency: this.priceCurrency,
      underlyingCurrency: this.underlyingCurrency,
      timestamp: null,
      amount: null,
      count: null,
      open: null,
      close: null,
      low: null,
      high: null,
      vol: null,
      deepBids: null,
      deepAsks: null,
    };

    init(info, this.WS_URL, (msg) => {
      switch (msg.channel) {
        case info[0].channel: {
          target.high = msg.ticker.high;
          target.low = msg.ticker.low;
          target.amount = msg.ticker.vol;
          break;
        }
        case info[1].channel: {
          target.timestamp = msg.timestamp;
          target.deepBids = msg.bids;
          target.deepAsks = msg.asks;
          break;
        }
      }
      // console.log(target);
    });

    function init(info, url, fn) {
      /* 参数1 */
      var ws = new WebSocket(url);
      ws.on('open', () => {
        console.log('open');
        subscribe(ws, info);
      });

      ws.on('message', (data) => {
        console.log('message');
        let msg = JSON.parse(data);
        // console.log(msg);
        fn(msg);
      });

      ws.on('close', () => {
        console.log('close');
        init();
      });

      ws.on('error', err => {
        console.log('error', err);
        init();
      });

      return ws;
    }

    function subscribe(ws, info) {
      ws.send(JSON.stringify(info[0]));
      ws.send(JSON.stringify(info[1]));
    }

    this.timer = setInterval(() => {
      self.onData(target);
    }, this.interval);
  }

  stop() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
  }

  test() {
    console.log(this.priceCurrency, this.underlyingCurrency);
  }
}

/* for HB */
class HBProvider extends Provider {
  constructor(params) {
    super(params)
    this.type = 'HB';
    this.WS_URL = "wss://api.huobi.pro/ws";
    this.timer = undefined;
  }

  start() {
    const info = [
      {
        "sub": `market.${this.priceCurrency}${this.underlyingCurrency}.depth.step0`,
        "id": `${this.priceCurrency}${this.underlyingCurrency}`
      },
      {
        "sub": `market.${this.priceCurrency}${this.underlyingCurrency}.kline.1min`,
        "id": `${this.priceCurrency}${this.underlyingCurrency}`
      }
    ];

    const self = this;

    let target = {
      type: this.type,
      priceCurrency: this.priceCurrency,
      underlyingCurrency: this.underlyingCurrency,
      timestamp: null,
      amount: null,
      count: null,
      open: null,
      close: null,
      low: null,
      high: null,
      vol: null,
      deepBids: null,
      deepAsks: null,
    };

    init(info, this.WS_URL, (msg) => {
      switch (msg.ch) {
        case info[0].sub: {
          target.timestamp = msg.ts;
          target.deepBids = msg.tick.bids;
          target.deepAsks = msg.tick.asks;
          break;
        }
        case info[1].sub: {
          for (let key in msg.tick) {
            if (target.hasOwnProperty(key)) {
              target[key] = msg.tick[key];
            }
          }
          target.timestamp = msg.ts;
          break;
        }
      }
      // console.log(target);
    });

    function init(info, url, fn) {
      var ws = new WebSocket(url);
      ws.on('open', () => {
        console.log('open');
        subscribe(ws, info);
      });

      ws.on('message', (data) => {
        let text = pako.inflate(data, {
          to: 'string'
        });
        let msg = JSON.parse(text);
        if (msg.ping) {
          ws.send(JSON.stringify({
            pong: msg.ping
          }));
        } else if (msg.tick) {
          fn(msg);
        } else {
          console.log(text);
        }
      });

      ws.on('close', () => {
        console.log('close');
        init();
      });

      ws.on('error', err => {
        console.log('error', err);
        init();
      });

      function subscribe(ws, info) {
        ws.send(JSON.stringify(info[0]));
        ws.send(JSON.stringify(info[1]));
      }

      return ws;
    }

    this.timer = setInterval(() => {
      self.onData(target);
    }, this.interval);
  }

  stop() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
  }

  test() {
    console.log(this.priceCurrency, this.underlyingCurrency);
  }
}

/* for BA */
class BAProvider extends Provider {
  constructor(params) {
    super(params)
    this.type = 'BA';
    this.WS_URL = "wss://stream.binance.com:9443";
    this.timer = undefined;
  }

  start() {
    const info = [
      `/ws/${this.priceCurrency}${this.underlyingCurrency}@kline_1m`,
      `/ws/${this.priceCurrency}${this.underlyingCurrency}@depth5`,
    ];

    const self = this;

    let target = {
      type: this.type,
      priceCurrency: this.priceCurrency,
      underlyingCurrency: this.underlyingCurrency,
      timestamp: null,
      amount: null,
      count: null,
      open: null,
      close: null,
      low: null,
      high: null,
      vol: null,
      deepBids: null,
      deepAsks: null,
    };

    init(info, this.WS_URL, (msg) => {
      if (msg.e == 'kline') {
        target.open = msg.k.o;
        target.close = msg.k.c;
        target.low = msg.k.l;
        target.high = msg.k.h;
        target.amount = msg.k.n;
        target.timestamp = msg.e;
      } else {
        target.deepBids = msg.bids;
        target.deepAsks = msg.asks;
      }
      console.log(target);
    });

    function init(info, url, fn) {
      var wsKline = new WebSocket(url + info[0]);
      wsKline.on('open', () => {
        console.log('open');
      });

      wsKline.on('message', (data) => {
        console.log('message');
        let msg = JSON.parse(data);
        // console.log(msg);
        fn(msg);
      });

      wsKline.on('close', () => {
        console.log('close');
        init();
      });

      wsKline.on('error', err => {
        console.log('error', err);
        init();
      });

      var wsDepth = new WebSocket(url + info[1]);
      wsDepth.on('open', () => {
        console.log('open');
      });

      wsDepth.on('message', (data) => {
        // console.log('message');
        let msg = JSON.parse(data);
        // console.log(msg);
        fn(msg);
      });

      wsDepth.on('close', () => {
        console.log('close');
        init();
      });

      wsDepth.on('error', err => {
        console.log('error', err);
        init();
      });

      return {wsKline,wsDepth};
    }

    // this.timer = setInterval(() => {
    //   self.onData(target);
    // }, this.interval);
  }

  stop() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
  }

  test() {
    console.log(this.priceCurrency, this.underlyingCurrency);
  }
}

module.exports = {
  OKProvider,
  ZBProvider,
  HBProvider,
  BAProvider,
}