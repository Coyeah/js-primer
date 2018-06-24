// Customer.js
/*
  声明顾客类
    方法：点菜，吃
 */
/*
function Customer () {
  this.orderList = [];

  this.order = function (menu) {
    let i = Math.floor(Math.random() * 10);
    console.log("Customer: I want a " + menu[i].name + ".");
    this.orderList.push(menu[i]);
    return menu[i].name;
  }
  this.eat = function () {
    console.log("Customer: Thank you! I started eating.");
  }
  this.sitdown = function () {
    console.log("Customer: I've already sat down.");
  }
  this.leave = function () {
    console.log("I finished eating and leaving.");
  }
}
 */

class Customer {
  constructor () {
    this.orderList = [];
  }

  order (menu) {
    let i = Math.floor(Math.random() * 10);
    console.log(">> Customer Order " + menu[i].name + ".");
    this.orderList.push(menu[i].name);
  }

  eat () {
    console.log(">> Customer Eating.");
  }

  sitdown () {
    console.log(">> Customer Sitdown.");
  }

  leave () {
    console.log(">> Customer Leaving.");
  }
}

export default Customer;
