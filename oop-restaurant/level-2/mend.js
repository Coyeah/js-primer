/*
  声明餐厅类
    属性：金钱，座位数量、职员列表
    方法：招聘职员，解雇职员
 */
function Restaurant (props) {
  this.cash = props.cash;
  this.seats = props.seats;
  this.staff = props.staff;
  this.hire = function (newStaff) {
    this.staff.push(newStaff);
  }
  this.fire = function (oldStaff) {
    this.staff = this.staff.filter((value, index) => {
      if (value.id == oldStaff.id) {
        return false;
      } else {
        return true;
      }
    });
  }
}

/*
  声明职员类
    属性：ID，姓名，工资
    方法：完成一次工作
 */
function Staff (name, salary, id) {
  this.name = name;
  this.salary = salary;
  this.id = id;

}
Staff.prototype.work = function () {
  console.log('Finish a work');
}

/*
  声明服务员类，继承自职员
    完成一次工作：如果参数是个数组，则记录客人点菜，如果参数不是数组则是上菜行为
 */
function Waiter (name, salary, id) {
  let instance = null;
  Staff.call(this, name, salary, id);
  instance = this;

  Waiter = function () {
    return instance;
  }

}
Waiter.prototype = new Staff();
Waiter.prototype.constructor = Waiter;

/*
  声明厨师类，继承自职员
    完成一次工作：烹饪出菜品
 */
function Cook (name, salary, id) {
  let instance = null;
  Staff.call(this, name, salary, id);
  instance = this;

  Cook = function () {
    return instance;
  }
}
Cook.prototype = new Staff();
Cook.prototype.constructor = Cook;

/*
  声明顾客类
    方法：点菜，吃
 */
function Customer () {
  this.order = function () {

  }
  this.eat = function () {

  }
}

/*
  声明菜品类
    属性：名字、烹饪成本、价格
 */
function Dishes (name, cost, price) {
  this.name = name;
  this.cost = cost;
  this.price = price;
}

// 测试用例

let w1 = new Cook("d1", 1001, 1011);
let w2 = new Cook("d2", 1002, 1012);
let w3 = new Cook("d3", 1003, 1013);
let w4 = new Cook("d4", 1004, 1014);
let w5 = new Cook("d5", 1005, 1015);

console.log(w1);
console.log(w2);
console.log(w3);
console.log(w4);
console.log(w5);
