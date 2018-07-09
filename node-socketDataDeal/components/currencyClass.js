const {EXCHANGE_TYPE} = require('../constants/model');

// focus to underlyingCurrency
class UnderlyingCurrency {
  constructor(underlyingCurrency) {
    this._underlyingCurrency = underlyingCurrency;
    this._data = [];
  }

  getUnderlyingCurrency() {
    return this._underlyingCurrency;
  }

  addData(obj) {
    this._data.push(obj);
  }

  getData() {
    return this._data;
  }
}

// focus to priceCurrency
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

// focus to exchange
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
}

module.exports = {
  Exchange,
  PriceCurrency,
  UnderlyingCurrency,
}