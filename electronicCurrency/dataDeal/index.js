const Exchange = require('./models/Exchange');
const PriceCurrency = require('./models/PriceCurrency');
const UnderlyingCurrency = require('./models/UnderlyingCurrency');

const { 
  OKProvider,
  ZBProvider,
  HBProvider,
  BAProvider,
 } = require('./components/fetchData');

const { ZB, HB, BA, OK } = Exchange.EXCHANGE_TYPE;
const { BTC, USD, LTC, BNB } = Exchange.CURRENCY_TYPE;

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
let uc1 = new UnderlyingCurrency(USD);
let pc1 = new PriceCurrency(BTC)
pc1.addUnderlyingCurrencies(uc1);
let exchange1 = new Exchange(OK);
exchange1.addPriceCurrency(pc1);
exchanges.push(exchange1);

let uc2 = new UnderlyingCurrency(BTC);
let pc2 = new PriceCurrency(LTC);
pc2.addUnderlyingCurrencies(uc2);
let exchange2 = new Exchange(HB);
exchange2.addPriceCurrency(pc1);
exchanges.push(exchange2);

let uc3 = new UnderlyingCurrency(BTC);
let pc3 = new PriceCurrency(LTC);
pc3.addUnderlyingCurrencies(uc3);
let exchange3 = new Exchange(ZB);
exchange3.addPriceCurrency(pc3);
exchanges.push(exchange3);

let uc4 = new UnderlyingCurrency(BTC);
let pc4 = new PriceCurrency(BNB);
pc4.addUnderlyingCurrencies(uc4);
let exchange4 = new Exchange(BA);
exchange4.addPriceCurrency(pc4);
exchanges.push(exchange4);

class DataDeal {
  constructor(exchanges, interval) {
    this.exchanges = exchanges;
    this.interval = interval || 500;
  }

  builtProvider(type) {
    switch (type) {
      case ZB: {
        return ZBProvider;
        break;
      }
      case OK: {
        return OKProvider;
        break;
      }
      case HB: {
        return HBProvider;
        break;
      }
      case BA: {
        return BAProvider;
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
              console.log(uc);
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