const {EXCHANGE_TYPE} = require('./constants/model');
const {CURRENCY_TYPE} = require('./constants/model');
// const CurrencyClass = require('./components/currencyClass');

const OKProvider = require('./components/fetchData');

const { ZB, HB, BA, OK } = EXCHANGE_TYPE;
const { BTC, ITC, ETH, ETC, BCC, USD } = CURRENCY_TYPE;

const exchanges = [
  {
    type: OK,
    priceCurrencies: [
      {
        name: BTC,
        underlyingCurrencies: [
          {
            name: USD,
            data: []
          },
        ]
      },
      // {
      //   name: ITC,
      //   underlyingCurrencies: [
      //     {
      //       name: USD,
      //       data: []
      //     },
      //   ]
      // },
      // {
      //   name: ETH,
      //   underlyingCurrencies: [
      //     {
      //       name: USD,
      //       data: []
      //     },
      //   ]
      // },
      // {
      //   name: ETC,
      //   underlyingCurrencies: [
      //     {
      //       name: USD,
      //       data: []
      //     },
      //   ]
      // },
    ]
  }
];

class DataDeal {
  constructor(exchanges, interval) {
    this.exchanges = exchanges;
    this.interval = interval || 500;
  }

  builtProvider(type) {
    switch (type) {
      case ZB: {
        return OKProvider;
        break;
      }
      case HB: {
        return OKProvider;
        break;
      }
      case BA: {
        return OKProvider;
        break;
      }
      case OK: {
        return OKProvider;
        break;
      }
    }
  }

  start() {
    
    const timer = () => {
      console.log('start');
      setTimeout(() => {
        this.exchanges.forEach((p1) => {
          p1.priceCurrencies.forEach((p2) => {
            p2.underlyingCurrencies.forEach((p3) => {
              console.log('------------->');
              console.log(p3.data);
            })
          })
        });
        timer();
      }, 1000);
    }

    timer();

    // console.log(this.exchanges);
    // let currency = new CurrencyClass()
    this.exchanges.forEach((exchange) => {
      // console.log(exchange.type);
      exchange.priceCurrencies.forEach((pc) => {
        // console.log(pc.name);
        pc.underlyingCurrencies.forEach((uc) => {
          // console.log(uc.name);
          const ProviderClass = this.builtProvider(exchange.type);
          const provider = new ProviderClass({
            priceCurrency: pc.name,
            underlyingCurrency: uc.name,
            onData: (data) => {
              uc.data.push(data);
            },
            interval: this.interval,
          });
          provider.start();
        });
      });
    });
  }
}

let demo = new DataDeal(exchanges);
demo.start();

module.exports = DataDeal;