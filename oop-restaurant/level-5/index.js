/*
  声明餐厅类
    属性：金钱，座位数量、职员列表
    方法：招聘职员，解雇职员
 */
function Restaurant (props) {
  this.cash = props.cash;
  this.seats = props.seats;
  this.staff = props.staff;
  this.queue = props.queue;
  this.menu = props.menu;

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
Restaurant.prototype = {
  constructor: Restaurant,
  enqueue: function () {
    let element = new Customer();
    this.queue.push(element);
  },
  dequeue: function () {
    return this.queue.shift();
  },
  front: function () {
    return this.queue[0];
  },
  isEmpty: function () {
    return this.queue.length == 0;
  },
  size: function () {
    return this.queue.length;
  },
  clear: function () {
    this.queue = [];
  },
  print: function () {
    console.log(this.queue.toString());
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

/*
  声明厨师类，继承自职员
    完成一次工作：烹饪出菜品
 */
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

/*
  声明顾客类
    方法：点菜，吃
 */
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

/*
  声明菜品类
    属性：名字、烹饪成本、价格
 */
function Dishes (name, cost, price, unitTime) {
  this.name = name;
  this.cost = cost;
  this.price = price;
  this.unitTime = unitTime;
}


/*
  职责链模式
  1-请求模块
  2-响应数据适配模块
  3-创造组件模块  
 */

// 创建菜单
const menu = (function () {
  let fish = new Dishes("fish", 10, 15, 3);
  let tofu = new Dishes("tofu", 20, 30, 5);
  let chicken = new Dishes("chicken", 12, 18, 6);
  let dumplings = new Dishes("dumplings", 22, 32, 2);
  let rice = new Dishes("rice", 2, 3, 1);
  let cabbage = new Dishes("cabbage", 16, 22, 5);
  let beef = new Dishes("beef", 6, 12, 8);
  let salad = new Dishes("salad", 14, 21, 4);
  let sandwich = new Dishes("sandwich", 21, 28, 5);
  let bacon = new Dishes("bacon", 11, 19, 2);

  return [fish, tofu, chicken, dumplings, rice, cabbage, beef, salad, sandwich, bacon];
})();

// 实例化餐厅
const IFERestaurant = new Restaurant({
    cash: 10000,
    seats: 20,
    staff: [],
    queue: [],
    menu: menu
});

// 创建顾客队列 & dom实例出顾客Icon
let clients = document.getElementById('clients');
for (let i = 0; i < 5; i++) {
  IFERestaurant.enqueue();
  let style = 'left:580px;top:' + (450 - i * 90) + 'px;'
  clients.innerHTML += '<img style="' + style + '" src="../image/customer.png" />';
}
for (let i = 0; i < 5; i++) {
  IFERestaurant.enqueue();
  let style = 'left:660px;top:' + (450 - i * 90) + 'px;'
  clients.innerHTML += '<img style="' + style + '" src="../image/customer.png" />';
}

const waiter = new Waiter("Lily", 8000);
const cook = new Cook("Tony", 10000);

const unitTime = 500;

// 第一站
let sendData = function (restaurant) {
  dealData(restaurant, 'customerOrder');

}

// 第二站
let dealData = function (data, dealType, key) {
  switch (dealType) {
    case 'customerOrder': {
      let restaurant = data;
      let menu = restaurant.menu;

      logHandler("sat down", "Customer");
      restaurant.queue[0].sitdown();
      
      customerOrder(menu, restaurant);
      break;
    }
    case 'waiterOrder': {
      let restaurant = data
      waiterOrder(restaurant);
      break;
    }
    case 'cookOrder': {
      let restaurant = data;
      let index = key;
      cookOrder(restaurant, index);
      break;
    }
    case 'waiterServe': {
      let restaurant = data;
      let index = key;
      waiterServe(restaurant, index);
      break;
    }
    case 'customerEat': {
      let restaurant = data;
      customerEat(restaurant);
      break;
    }
    case 'customerLeave': {
      let restaurant = data;
      customerLeave(restaurant);
      break;
    }
  }
}

// 第三站

let customerOrder = function (menu, restaurant) {

  iconHandler(450, 357.5, clients.getElementsByTagName('img')[0], 'CUSTOMER_IN');
  
  logHandler("Thinking", "Customer");

  console.log("------> Customer Thinking <------");
  let orderList = [];

  let order = new Promise (function (resolve, reject) {
    setTimeout(function () {
      let i = Math.floor(Math.random() * 10 + 1);
      for (; i > 0; i--) {
        orderList.push(restaurant.queue[0].order(menu));
      }
      resolve(restaurant);
    }, 3 * unitTime);
  });

  order.then(function (restaurant) {

    textHandler("I want " + orderList, "customerToWaiter");
    logHandler("Order: " + orderList, "Waiter");

    dealData(restaurant, 'waiterOrder');
  });
}

let waiterOrder = function (restaurant) {
  console.log("------> Waiter Sending Order List To Cook <------");

  let orderList = [];
  for (let i = 0; i < restaurant.queue[0].orderList.length; i++) {
    orderList.push(restaurant.queue[0].orderList[i].name);
  }
  textHandler("The customer want " + orderList, "waiterToChef");
  logHandler("Customer's Order: " + orderList, "Waiter");

  waiter.getOrder(restaurant.queue[0].orderList);
  dealData(restaurant, 'cookOrder', 0);
}

let cookOrder = function (restaurant, index) {
  console.log("------> Cook Cooking The Item of Order List <------");
 
  textHandler("I'm cooking " + restaurant.queue[0].orderList[index].name, "chefToWaiter");
  logHandler("Cooking " + restaurant.queue[0].orderList[index].name, "Cook");

  cook.cooking(restaurant.queue[0].orderList[index]);
  let cooking = new Promise (function (resolve, reject) {
    setTimeout(function () {
      resolve(restaurant);
    }, restaurant.queue[0].orderList[index].unitTime * unitTime);
  });
  cooking.then(function (restaurant) {
    dealData(restaurant, 'waiterServe', index);
  })
}

let waiterServe = function (restaurant, index) {
  waiter.serverDishes();
  if (restaurant.queue[0].orderList.length - 1 != index) {

    textHandler("Here is your " + restaurant.queue[0].orderList[index].name, "waiterToCustomer");

    dealData(restaurant, 'cookOrder', index + 1);
  } else {

    textHandler("Here is your " + restaurant.queue[0].orderList[index].name, "waiterToCustomer");
    textHandler("Order was finished", "chefToWaiter");
    logHandler("Order was finished", "Cook");

    dealData(restaurant, 'customerEat');
  }
}

let customerEat = function (restaurant) {
  console.log("------> Customer Eating <------");

  textHandler("I'm eating", "customerToWaiter");
  logHandler("Eating", "Customer");

  restaurant.queue[0].eat();
  let eating = new Promise (function (resolve, reject) {
    setTimeout(function () {
      restaurant.queue[0].leave();

      textHandler("I'm leaving", "customerToWaiter");
      logHandler("Leaving", "Customer");

      resolve();
    }, restaurant.queue[0].orderList.length * 3 * unitTime);
  });
  eating.then(function () {
    dealData(restaurant, 'customerLeave');
  })
}

let customerLeave = function (restaurant) {
  restaurant.queue[0].leave();

  let iconOut = iconHandler(800, 357.5, clients.getElementsByTagName('img')[0], 'CUSTOMER_OUT');
  // clients.removeChild(clients.getElementsByTagName('img')[0]);

  iconOut.then(function () {
    restaurant.dequeue();
    console.log("------> Customer Leave <------");
    if (!restaurant.isEmpty()) {
      dealData(restaurant, 'customerOrder');
    } else {
      console.log(">>>>> END <<<<<");
    }
  });
}

// dom文字操作
let logHandler = function (text, type) {
  let date = new Date();
  let textArea = document.getElementById('text');
  let content = textArea.innerHTML;
  let newStr = [
    "<p>",
      "<span>",
        type + "(" + date.toLocaleTimeString() + ") :",
      "</span>",
    text + "</p>"
  ].join('');
  textArea.innerHTML = newStr + content;
}

// dom图标操作
let iconHandler = function (top, left, dom, type) {
  // dom.style.top = top + 'px';
  // dom.style.left = left + 'px';
  switch (type) {
    case 'CUSTOMER_IN': {
      dom.style.top = top + 'px';
      dom.style.left = left + 'px';
      break;
    }
    case 'CUSTOMER_OUT': {
      dom.style.top = top + 'px';
      dom.style.left = left + 'px';
      return new Promise (function (resolve, reject) {
        setTimeout(function () {
          clients.removeChild(dom);
          resolve();
        }, 500);
      });
      break;
    }
  }
}

let textHandler = function (text, type) {
  let dom = document.getElementById(type);
  dom.innerHTML = text;
}

let operate = document.getElementById('operate');
let start = operate.getElementsByTagName('button')[0];
let time = operate.getElementsByTagName('p')[0];

function timeLoop () {
  let date = new Date();
  time.innerHTML = date.toLocaleTimeString();
  setTimeout(function () {
    timeLoop();
  }, 1000);
}


// 测试用例
// sendData(IFERestaurant);

timeLoop();

start.onclick = function () {
  sendData(IFERestaurant);
};
