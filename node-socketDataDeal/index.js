const { EXCHANGE_TYPE } = require('./constants/model');
const { CURRENCY_TYPE } = require('./constants/model');
const { Exchange, PriceCurrency, UnderlyingCurrency } = require('./components/currencyClass');

const { OKProvider } = require('./components/fetchData');

const { ZB, HB, BA, OK } = EXCHANGE_TYPE;
const { BTC, ITC, ETH, ETC, BCC, USD } = CURRENCY_TYPE;

// const exchanges = [
//   {
//     type: OK,
//     priceCurrencies: [
//       {
//         name: BTC,
//         underlyingCurrencies: [
//           {
//             name: USD,
//             data: []
//           },
//         ]
//       },
//       {
//         name: ITC,
//         underlyingCurrencies: [
//           {
//             name: USD,
//             data: []
//           },
//         ]
//       },
//       {
//         name: ETH,
//         underlyingCurrencies: [
//           {
//             name: USD,
//             data: []
//           },
//         ]
//       },
//       {
//         name: ETC,
//         underlyingCurrencies: [
//           {
//             name: USD,
//             data: []
//           },
//       ]
//       },
//     ]
//   }
// ];

const exchanges = [];
let uc = new UnderlyingCurrency(USD);
let pc = new PriceCurrency(BTC)
pc.addUnderlyingCurrencies(uc);
let exchange = new Exchange(OK);
exchange.addPriceCurrency(pc);
exchanges.push(exchange);

class DataDeal {
  constructor(exchanges, interval) {
    this.exchanges = exchanges;
    this.interval = interval || 500;
  }

  builtProvider(type) {
    switch (type) {
      case OK: {
        return OKProvider;
        break;
      }
    }
  }

  start() {

    // this.exchanges.forEach((exchange) => {
    //   // console.log(exchange.type);
    //   exchange.priceCurrencies.forEach((pc) => {
    //     // console.log(pc.name);
    //     pc.underlyingCurrencies.forEach((uc) => {
    //       // console.log(uc.name);
    //       const ProviderClass = this.builtProvider(exchange.type);
    //       const provider = new ProviderClass({
    //         priceCurrency: pc.name,
    //         underlyingCurrency: uc.name,
    //         onData: (data) => {
    //           //uc.data.push(data);
    //           dataDeal.call(this, uc.data, data);
    //         },
    //         interval: this.interval,
    //       });
    //       provider.start();
    //     });
    //   });
    // });

    this.exchanges.forEach((exchange) => {
      // console.log(exchange.getType());
      exchange.getPriceCurrencies().forEach((pc) => {
        // console.log(pc.getPriceCurrency());
        pc.getUnderlyingCurrencies().forEach((uc) => {
          // console.log(uc.getUnderCurrency());
          const ProviderClass = this.builtProvider(exchange.getType() );
          const provider = new ProviderClass({
            priceCurrency: pc.getPriceCurrency(),
            underlyingCurrency: uc.getUnderlyingCurrency(),
            onData: (data) => {
              uc.addData(data);
            },
            interval: this.interval,
          });
          provider.start();
        });
      });
    });
  }
}

// const dataDeal = (container, data) => {
//   container.push(data);
//   console.log(data);
// }

let demo = new DataDeal(exchanges);
demo.start();

module.exports = DataDeal;