// manager.js
// action
import chainFlow from './chainFlow.js';
import observer from './observer.js';
import newCustomer from './newCustomer.js';

let manager = function (restaurant) {
  restaurant.enqueue();
  chainFlow(restaurant);
}


export default manager;