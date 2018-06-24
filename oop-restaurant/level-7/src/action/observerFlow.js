// observerFlow.js
// class
import Customer from '../class/Customer.js';

// action
import Observer from './Observer.js';

let observer = Observer();

let unitTime = 500;

let observerFlow = function (restaurant) {
  randomCustomer(restaurant);
}

let randomCustomer = function (restaurant) {
  let flag = random(2) === 0 ? true : false;
  if (flag) {
    restaurant.enqueue();
  }
  console.log(restaurant.size());

  setTimeout(function () {
    randomCustomer(restaurant);
  }, random(10) * unitTime);
}

let random = function (max) {
  return Math.floor(Math.random() * max);
}

export default observerFlow;