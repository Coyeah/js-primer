const ExchangeDB = require('./dataBase/index');
const DataFetch = require('./dataFetch/index');
const Tactics = require('./dataRule/index');

const user = require('./dataRule/data');

const Exchange = require('./dataFetch/models/Exchange');
const { ZB, HB, BA, OK } = Exchange.EXCHANGE_TYPE;
const { BTC, USD, LTC, BNB } = Exchange.CURRENCY_TYPE;

const db = new ExchangeDB();

db.addMonitor(OK, BTC, USD);

const fetch = new DataFetch(db.exchanges);
fetch.start();

const tac = new Tactics(db, user)
tac.start();