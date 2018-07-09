const WebSocket = require('ws');

/* Provider */
class Provider {
  constructor (params) {
    this.priceCurrency = params.priceCurrency;
    this.underlyingCurrency = params.underlyingCurrency;
    this.onData = params.onData;
    this.interval = params.interval || 500;
  }
}

class OKProvider extends Provider {
  constructor (params) {
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

     /* target format:
      * type
      * priceCurrency
      * underlyingCurrency
      * timestamp
      * count
      * open
      * close
      * low
      * high
      * vol
      * deepBids
      * deepAsks
      */
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
                if(target.hasOwnProperty(key)) {
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
            if(target.hasOwnProperty(key)) {
              target[key] = msg[0].data[key]; 
            } else {
              switch(key) {
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
      // init();
  });

  ws.on('error', err => {
    console.log('error', err);
    // init();
  });

  function subscribe(ws, info) {
    ws.send(JSON.stringify(info));
  }

  return ws;
}

module.exports = {
  OKProvider,
}