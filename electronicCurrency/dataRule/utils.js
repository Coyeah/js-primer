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
  } catch(e) {
    console.error(e);
  }
  return finalObject;
}

module.exports = {
  countAverage,
  deepCopy,
}