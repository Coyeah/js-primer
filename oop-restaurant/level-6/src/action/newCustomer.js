// newCustomer.js
// class
import Customer from '../class/Customer.js';

let newCustomer = function () {
  let flag = random(2) == 0 ? true : false;
  if (!flag) return [];

  let i = random(5);
  let list = [];
  for (; i >= 0; i++) {
    let element = new Customer();
    list.push(element);
  }
  
  return list;
}

let random = function (max) {
  return Math.floor(Math.random() * max);
}

export default newCustomer;