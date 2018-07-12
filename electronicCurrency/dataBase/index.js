const Exchange = require('../dataFetch/models/Exchange');
const PriceCurrency = require('../dataFetch/models/PriceCurrency');
const UnderlyingCurrency = require('../dataFetch/models/UnderlyingCurrency');

const { ZB, HB, BA, OK } = Exchange.EXCHANGE_TYPE;
const { BTC, USD, LTC, BNB } = Exchange.CURRENCY_TYPE;

class ExchangeDB {

  constructor() {
    if (ExchangeDB.prototype.Instance === undefined) {
      this.exchanges = [];
      ExchangeDB.prototype.Instance = this;
    }
    return ExchangeDB.prototype.Instance;
  }

  start() {

  }

  onData(fn) {
    setInterval(() => {
      let test = this.getData(OK, BTC, USD);
      fn(test[test.length - 1].buy);
    }, 500);
  }

  getData(ex, pc, uc) {
    let data;
    this.exchanges.forEach((v1) => {
      if (v1.getType() == ex) {
        v1.getPriceCurrencies().forEach((v2) => {
          if (v2.getPriceCurrency() == pc) {
            v2.getUnderlyingCurrencies().forEach((v3) => {
              if (v3.getUnderlyingCurrency() == uc) {
                data = v3.getData();
              }
            });
          }
        });
      }
    });
    return data;
  }

  addMonitor(exchange, priceCurrency, underlyingCurrency) {
    let uc = new UnderlyingCurrency(underlyingCurrency);
    let pc = new PriceCurrency(priceCurrency);
    pc.addUnderlyingCurrencies(uc);
    let ex = new Exchange(exchange);
    ex.addPriceCurrency(pc);
    this.exchanges.push(ex);
  }
}

module.exports = ExchangeDB;