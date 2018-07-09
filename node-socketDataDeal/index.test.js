const { ZBProvider } = require('./components/fetchData');

const demo = new ZBProvider({
  priceCurrency: 'ltc',
  underlyingCurrency: 'btc'
});
demo.start();