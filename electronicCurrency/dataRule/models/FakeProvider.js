class FakeProvider {
  constructor(exchange, priceCurrency, underlyingCurrency) {
    this.exchagne = exchange;
    this.priceCurrency = priceCurrency;
    this.underlyingCurrency = underlyingCurrency;
  }

  start(fn) {
    let data = [6.1, 5.4, 3.4, 1.8, 5.5, 4.1, 4.3, 4.8, 6.1, 4.5, 7.2, 6.1, 5.2, 4.8];
    for (let i = 0; i < data.length; i++) {
      ((j) => {
        setTimeout(() => {
          fn(data[j]);
        }, 500 * j);
      })(i)
    }
  }
}

module.exports = FakeProvider;