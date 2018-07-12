const { BAProvider } = require('./components/fetchData');

const demo = new BAProvider({
  priceCurrency: 'bnb',
  underlyingCurrency: 'btc'
});
demo.start();