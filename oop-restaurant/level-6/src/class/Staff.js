// Staff.js
/*
  声明职员类
    属性：ID，姓名，工资
    方法：完成一次工作
 */
/*
function Staff (name, salary, id) {
  this.name = name;
  this.salary = salary;
  this.id = id;

}
Staff.prototype.work = function () {
  console.log('Finish a work');
}
 */

/*
  声明服务员类，继承自职员
    完成一次工作：如果参数是个数组，则记录客人点菜，如果参数不是数组则是上菜行为
 */
/*
function Waiter (name, salary, id) {
  let instance = null;
  Staff.call(this, name, salary, id);
  instance = this;

  this.getOrder = function (orderList) {
    for (let i = 0; i < orderList.length; i++) {
      console.log("Waiter: The customer want " + orderList[i].name + ".");
    }
  }

  this.serverDishes = function () {
    console.log("Waiter: Yours, Sir.");
  }

  Waiter = function () {
    return instance;
  }

}
Waiter.prototype = new Staff();
Waiter.prototype.constructor = Waiter;
 */

/*
  声明厨师类，继承自职员
    完成一次工作：烹饪出菜品
 */
/*
function Cook (name, salary, id) {
  let instance = null;
  Staff.call(this, name, salary, id);
  instance = this;

  this.cooking = function (orderItem) {
    console.log("Cook: Ok, i'm cooking " + orderItem.name + "!");
  }

  this.finishedCook = function () {
    console.log("Cook: I have finished.");
  }

  Cook = function () {
    return instance;
  }
}
Cook.prototype = new Staff();
Cook.prototype.constructor = Cook;
 */

class Staff {
  constructor (name, salary, id, type) {
    this.name = name;
    this.salary = salary;
    this.id = id;
    this.type = type;
  }

  work () {
    console.log("A work by staff.");
  }
}

class Waiter extends Staff {
  constructor (name, salary, id) {
    super(name, salary, id);
  }

  getOrder (orderList) {
    for (let i = 0; i < orderList.length; i++) {
      console.log("Waiter: The customer want " + orderList[i].name + ".");
    }
  }

  serverDishes () {
    console.log("Waiter: Yours dishes, Sir.");
  }
}

class Chef extends Staff {
  constructor (name, salary, id) {
    super(name, salary, id);
  }

  cooking (orderItem) {
    console.log("Cook: Ok, i'm cooking " + orderItem.name + "!");
  }

  finishedCook () {
    console.log("Cook: I have finished.");
  }
}

export { Waiter, Chef }