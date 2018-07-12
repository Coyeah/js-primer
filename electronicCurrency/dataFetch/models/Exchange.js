class Exchange {
  constructor(type) {
    this._type = type;
    this._priceCurrencies = [];
  }

  getType() {
    return this._type;
  }

  addPriceCurrency(priceCurrency) {
    this._priceCurrencies.push(priceCurrency);
  }

  getPriceCurrencies() {
    return this._priceCurrencies;
  }

  static get EXCHANGE_TYPE() {
    return {
      ZB: 0,
      HB: 1,
      BA: 2,
      OK: 3,
    }
  };

  static get CURRENCY_TYPE() {
    return {
      BTC: 'btc',
      USD: 'usd',
      LTC: 'ltc',
      BNB: 'bnb',
    }
  };
}

module.exports = Exchange;