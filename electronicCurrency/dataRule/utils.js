const countAverage = (hold) => {
  let amount = 0;
  let price = 0;

  hold.forEach((value) => {
    amount += value.amount;
    price += value.inPrice * value.amount;
  });

  return price / amount;
}

const deepCopy = (initObject) => {
  let finalObject = {};
  try {
    finalObject = JSON.parse(JSON.stringify(initObject));
  } catch (e) {
    console.error(e);
  }
  return finalObject;
}

const checkType = {
  ACTION: 'ACTION',
  RETRACE: 'RETRACE',
  CONTINUE: 'CONTINUE'
}

const checkRate = (params) => {
  let { rate, retracement, newPrice, retracePrice, lastPrice } = params;
  /**
   * 0 - 涨状态 - 卖出策略
   * 1 - 跌状态 - 买入/补仓策略
   */
  let base = params.type == 0 ? 1 : -1;

  // console.log(params);

  if (typeof retracePrice == 'undefined') {
    let currentRate = base * (newPrice / lastPrice - 1);
    if (currentRate >= rate) {
      if (retracement === 0) {
        return { type: checkType.ACTION }
      } else {
        return { type: checkType.RETRACE }
      }
    }
  } else {
    let currentRate = base * (1 - newPrice / retracePrice);
    if (currentRate >= retracement) {
      return { type: checkType.ACTION }
    }
  }
  return { type: checkType.CONTINUE }
}

module.exports = {
  countAverage,
  deepCopy,
  checkRate,
  checkType,
}

// let test = checkRate({
//   type: 0,
//   rate: 0.3,
//   retracement: 0,
//   newPrice: 11,
//   retracePrice: undefined,
//   lastPrice: 3
// })

// console.log(test);