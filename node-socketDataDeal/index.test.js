const { HBProvider } = require('./components/fetchData');

const demo = new HBProvider({
  priceCurrency: 'ltc',
  underlyingCurrency: 'btc'
});
demo.start();