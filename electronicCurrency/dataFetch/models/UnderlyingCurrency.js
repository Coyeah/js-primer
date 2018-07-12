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

module.exports = UnderlyingCurrency;