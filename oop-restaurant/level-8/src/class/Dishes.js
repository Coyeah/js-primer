// Dishes.js
/*
  声明菜品类
    属性：名字、烹饪成本、价格
 */
/*
function Dishes (name, cost, price, unitTime) {
  this.name = name;
  this.cost = cost;
  this.price = price;
  this.unitTime = unitTime;
}
 */

class Dishes {
  constructor (name, cost, price, unitTime) {
    this.name = name;
    this.cost = cost;
    this.price = price;
    this.unitTime = unitTime;
  }
}

export default Dishes;