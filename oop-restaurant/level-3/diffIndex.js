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

  this.getOrder = function (dishes) {
    console.log("Waiter: The customer want " + dishes + ".");
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

/*
  声明厨师类，继承自职员
    完成一次工作：烹饪出菜品
 */
function Cook (name, salary, id) {
  let instance = null;
  Staff.call(this, name, salary, id);
  instance = this;

  this.cooking = function () {
    console.log("Cook: Ok, i'm cooking!");
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

/*
  声明顾客类
    方法：点菜，吃
 */
function Customer () {
  this.order = function () {
    let i = Math.floor(Math.random() * 10);
    console.log("Customer: I want a " + menu[i].name + ".");
    return menu[i].name;
  }
  this.eat = function () {
    console.log("Customer: Thank you! I started eating.");
  }
  this.sitdown = function () {
    console.log("Customer: I've already sat down.");
  }
  this.leave = function () {
    console.log("I finished eating.");
    console.log("------------------------------");
    queue.dequeue();
    if (!queue.isEmpty()) {
      return operation();
    } else {
      console.log("There is no customer.");
    }
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

/*
  声明队列
    用于处理顾客排队的情况
 */
function Queue() {
  this.items = [];
}
Queue.prototype = {
  constructor: Queue,
  enqueue: function () {
    let element = new Customer();
    this.items.push(element);
  },
  dequeue: function () {
    return this.items.shift();
  },
  front: function () {
    return this.items[0];
  },
  isEmpty: function () {
    return this.items.length == 0;
  },
  size: function () {
    return this.items.length;
  },
  clear: function () {
    this.items = [];
  },
  print: function () {
    console.log(this.items.toString());
  }


}


// 测试用例

// 创建菜单
let menu = (function () {
  let fish = new Dishes("fish", 10, 15);
  let tofu = new Dishes("tofu", 20, 30);
  let chicken = new Dishes("chicken", 12, 18);
  let dumplings = new Dishes("dumplings", 22, 32);
  let rice = new Dishes("rice", 2, 3);
  let cabbage = new Dishes("cabbage", 16, 22);
  let beef = new Dishes("beef", 6, 12);
  let salad = new Dishes("salad", 14, 21);
  let sandwich = new Dishes("sandwich", 21, 28);
  let bacon = new Dishes("bacon", 11, 19);

  return [fish, tofu, chicken, dumplings, rice, cabbage, beef, salad, sandwich, bacon];
})();

// 创建顾客队列
let queue = new Queue();
queue.enqueue();
queue.enqueue();
queue.enqueue();
queue.enqueue();
queue.enqueue();
queue.enqueue();
queue.enqueue();
queue.enqueue();
queue.enqueue();
queue.enqueue();

let waiter = new Waiter("Lily", 8000);
let cook = new Cook("Tony", 10000);

// 定义餐厅的一次流程函数
let operation = function () {
  queue.items[0].sitdown();
  let dishes = queue.items[0].order();
  waiter.getOrder(dishes);
  cook.cooking();
  cook.finishedCook();
  waiter.serverDishes();
  queue.items[0].eat();
  queue.items[0].leave();
};

operation();




 