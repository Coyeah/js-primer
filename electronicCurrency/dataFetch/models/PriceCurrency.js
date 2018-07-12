class PriceCurrency {
  constructor(priceCurrency, underlyingCurrencies) {
    this._priceCurrency = priceCurrency;
    this._underlyingCurrencies = [];
  }

  getPriceCurrency() {
    return this._priceCurrency;
  }

  addUnderlyingCurrencies(underlyingCurrency) {
    this._underlyingCurrencies.push(underlyingCurrency);
  }

  getUnderlyingCurrencies() {
    return this._underlyingCurrencies;
  }
}

module.exports = PriceCurrency;