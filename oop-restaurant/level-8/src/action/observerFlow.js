// observerFlow.js
// class
import Customer from '../class/Customer.js';
import { Waiter, Chef } from '../class/Staff.js';

// action
import Observer from './Observer.js';
import domDraw from './domDraw.js';

let observer = Observer();

// 餐厅占用位置数
let seats = 0;
// 餐厅位置名牌
let nameCard = {
  0: null, 1: null, 2: null, 3: null, 4: null,
  5: null, 6: null, 7: null, 8: null, 9: null
}
// dom位置路径
let location = [
  [20,910], [20,830], [20,750], [20,670], [20,590],
  [120,910], [120,830], [120,750], [120,670], [120,590]
];
let workerLocation = [120, 200, 280, 360, 440, 520];
// 厨师任务列表
let chefTask = [];
// 服务员任务列表
let waiterTask = {};
// 服务员工作中
let waiterWorking = {};
// 服务员工作中
let chefWorking = {};
// 客户要求服务的列表
let waiterList = [];
// 餐厅菜单
let menu = {};
// 定义服务员与厨师团队
let waiter, chef;
// 定义单位时间
let unitTime = 1000;

// DOM
let textBoard = document.getElementById('text');
let start = document.getElementById('operate').getElementsByTagName('button')[0];
let addWaiter = document.getElementById('operate').getElementsByTagName('button')[1];
let delWaiter = document.getElementById('operate').getElementsByTagName('button')[2];
let addChef = document.getElementById('operate').getElementsByTagName('button')[3];
let delChef = document.getElementById('operate').getElementsByTagName('button')[4];

// 自定义属性 



let observerFlow = function (restaurant) {
  // 初始化
  init(restaurant);

  start.onclick = function () {
    // 随机生成顾客
    randomCustomer(restaurant);
  };
}

// 初始化内容
let init = function (restaurant) {
  menu = tidyMenu(restaurant.menu);
  waiter = getStaff('waiter', restaurant.staff);
  chef = getStaff('chef', restaurant.staff);

  // 按钮功能
  addWaiter.onclick = function () {
    if (waiter.length < 5) {
      let date = new Date();
      let name = "w" + date.getTime();
      let target = new Waiter(name, 3000, date.getTime(), "waiter");
      restaurant.cash -= 3000;
      domDraw('addWorker', {type: true, top: workerLocation[waiter.length]});
      restaurant.hire(target);
      waiter = getStaff('waiter', restaurant.staff);
      textDraw('seats', restaurant);
    }
  };
  delWaiter.onclick = function () {
    if (waiter.length != 0) {
      if(isFreeWaiter()) {
        restaurant.fire(freeWaiter());
      }
      waiter = getStaff('waiter', restaurant.staff);
      domDraw('delWorker', {type: true, top: workerLocation[waiter.length]});
    }
  };
  addChef.onclick = function () {
    if (chef.length < 5) {  
      let date = new Date();
      let name = "c" + date.getTime();
      let target = new Chef(name, 5000, date.getTime(), "chef");
      restaurant.cash -= 5000;
      domDraw('addWorker', {type: false, top: workerLocation[chef.length]});
      restaurant.hire(target);
      chef = getStaff('chef', restaurant.staff);
      textDraw('seats', restaurant);
    }
  };
  delChef.onclick = function () {
    if (chef.length != 0) {
      if(isFreeChef()) {
        restaurant.fire(freeChef());
      }
      chef = getStaff('chef', restaurant.staff);
      domDraw('delWorker', {type: false, top: workerLocation[waiter.length]});
    }
  };

  initTextDraw(restaurant);

  // 创造人偶
  domDraw('customerCreate', {
    amount: restaurant.seats
  });

  // 监听是否有顾客在等待
  observer.regist('customerWait', restaurantRegist);
  // 监听是否需要服务员
  observer.regist('waiterCalled', waiterRegist);
  // 监听是否需要厨师
  observer.regist('chefCalled', chefRegist);
}

// 初始化文字渲染
let initTextDraw = function (restaurant) {
  textDraw('seats', restaurant);
  setTimeout(() => {
    initTextDraw(restaurant);
  }, 500);
}

// 获取职员
let getStaff = function (type, staff) {
  return staff.filter((value, index) => {
    if (value.type == type) {
      return true;
    } else {
      return false;
    }
  });
}

// 整理菜单
let tidyMenu = function (menu) {
  let obj = {};
  for (let i = 0; i < menu.length; i++) {
    obj[menu[i].name] = menu[i];
  }
  return obj;
}

// 文字渲染
let textDraw = function (type, data) {
  document.getElementById('operate').getElementsByTagName('p')[1].innerHTML = '餐厅本金：' + data.cash;
  document.getElementById('operate').getElementsByTagName('p')[2].innerHTML = '排队人数：' + (data.size() - seats);
  document.getElementById('operate').getElementsByTagName('p')[3].innerHTML = '空余位置：' + (data.seats - seats);
  document.getElementById('operate').getElementsByTagName('p')[4].innerHTML = '队列数量：' + data.size();
}

// 随机生成顾客
let randomCustomer = function (restaurant) {
  // 队列过长则不做反应
  if (restaurant.size() < 30) {
    restaurant.enqueue();

    let date = new Date();
    let id = date.getTime();

    // 为顾客设置id
    restaurant.queue[restaurant.size() - 1].tag(id);
  
    // 发布有顾客等待的消息
    observer.fire('customerWait', {restaurant, id});

    // 文字渲染 & 队列
    textDraw('queue', restaurant);
  }

  // 递归
  // 随机时间添加顾客
  setTimeout(() => {
    randomCustomer(restaurant);
  }, Math.floor(Math.random() * 5 + 1) * 1000);
}

// 餐厅监听调用方法
let restaurantRegist = function (events) {
  let restaurant = events.args.restaurant;
  let id = events.args.id;
  switch (events.type) {
    case 'customerWait': {
      if (seats < 10) {
        // 占用位置加一
        seats++;
        // 顾客进入餐厅
        customerIn(restaurant, id);
      }
    }
  }
}

// 服务员监听调用方法
let waiterRegist = function (events) {
  let restaurant = events.args.restaurant;
  if (waiterList.length != 0) {
    if (isFreeWaiter()) {
      let order = waiterList[0];
      waiterList.shift();
      let oneWaiter = freeWaiter();
      waiterWorking[oneWaiter.name] = oneWaiter;
      switch (order.type) {
        case 'customerOrder': {
          let id = order.id;
          // 调用方法 & 顾客点单
          customerOrder(restaurant, id, oneWaiter);
          break;
        }
        case 'chefOrder': {
          let dishes = order.dishes;
          customerServer(restaurant, dishes, oneWaiter);
          break;
        }
      }
    } else {
      setTimeout(function () {
        waiterRegist(events);
      }, 2000);
    }
  }
}

// 厨师监听调用方法
let chefRegist = function (events) {
  let restaurant = events.args.restaurant;
  console.log(chefTask);
  if (chefTask.length != 0) {
    console.log(isFreeChef());
    if (isFreeChef()) {
      let oneChef = freeChef();
      chefWorking[oneChef.name] = oneChef;
      switch (events.type) {
        case 'chefCalled': {
          observer.remove(events.type, chefRegist);
          // 调用方法 & 厨师烹饪 & 为每个厨师分配任务
          chefOrder(restaurant, oneChef);
          if (chefTask.length != 0) {
            chefRegist(events);
          }
          break;
        }
      }
    }
  }
}

let customerIn = function (restaurant, id) {
  // 顾客找到空位置
  nameCard[emptySeat(null)] = id;
  // 顾客入座
  focusCustomer(restaurant, id).sitdown();

  // 获取位置信息 & 入座动画
  let data = location[emptySeat(id)];
  let p1 = new Promise((resolve, reject) => {
    setTimeout(function () {
      domDraw('domMove', {
        left: data[1],
        top: data[0],
        dom: document.getElementById('clients').getElementsByTagName('img')[emptySeat(id)]
      })
      resolve();
    }, 500);
  });

  let p2 = p1.then(function () {
    waiterList.push({
      id,
      type: 'customerOrder'
    });
    // 发布消息 & 寻找空闲的服务员
    observer.fire('waiterCalled', {restaurant});
  })
}

let customerOrder = function (restaurant, id, oneWaiter) {

  let p1 = new Promise((resolve, reject) => {
    // 顾客思考
    setTimeout(function () {
      // 顾客点单
      let i = Math.floor(Math.random() * 10);
      for (; i > 0; i--) {
        focusCustomer(restaurant, id).order(restaurant.menu);
      }
      
      // 记录至服务员任务
      waiterTask[id] = focusCustomer(restaurant, id).orderList.length;

      resolve();
    }, 3 * unitTime);
  });

  let p2 = p1.then(() => {
    oneWaiter.getOrder(focusCustomer(restaurant, id).orderList);
    // 调用方法 & 服务员下单
    waiterOrder(restaurant, id, oneWaiter);
  });
}

let waiterOrder = function (restaurant, id, oneWaiter) {
  // 获取顾客订单
  let orderList = focusCustomer(restaurant, id).orderList;

  let sumMoney = 0;
  for (let i = 0; i < orderList.length; i++) {
    // 添加到厨房任务列表 - chefTask
    let target = chefTask.filter((value, index) => {
      if (value.name == orderList[i]) {
        return true;
      } else {
        return false;
      }
    });
    if (target.length == 0) {
      chefTask.push({
        amount: [id],
        name: orderList[i]
      });
    } else {
      target[0].amount.push(id);
    }

    // 计算成本
    sumMoney += menu[orderList[i]].cost;
  }

  // 支付成本
  restaurant.cash -=  sumMoney;
  // 文字渲染 & 现金
  textDraw('cash', restaurant);
  // 取消工作状态
  delete waiterWorking[oneWaiter.name];
  // 发布消息 & 寻找空闲的服务员
  observer.fire('chefCalled', {restaurant});
}

let chefOrder = function (restaurant, oneChef) {

  // 推出第一个任务
  let item = chefTask.shift();
  // 厨师烹饪
  oneChef.cooking(item);

  // 烹饪中
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, menu[item.name].unitTime * unitTime);
  });

  // 烹饪后
  let p2 = p1.then(() => {
    waiterList.push({
      type: 'chefOrder',
      dishes: item
    })
    // 发布消息 & 寻找空闲的服务员 & 把烹饪好的菜品交给服务员
    observer.fire('waiterCalled', {restaurant});
    // 任务栏中是否还有需要烹饪的菜品
    if (chefTask.length != 0) {
      chefOrder(restaurant, oneChef);
    } else {
      delete chefWorking[oneChef.name];
      // 重新监听 & 厨师空闲
      observer.regist('chefCalled', chefRegist);
    }
  });
}

let customerServer = function (restaurant, dishes, oneWaiter) {
  for (let i = 0; i < dishes.amount.length; i++) {
    // 修订
    waiterTask[dishes.amount[i]]--;
    oneWaiter.serverDishes();

    // 如果菜品全部完成，用户则开始食用
    if (waiterTask[dishes.amount[i]] == 0) {
      customerEat(restaurant, dishes.amount[i]);
      delete waiterTask[dishes.amount[i]];
    }
  }

  delete waiterWorking[oneWaiter.name];
  console.log(waiterTask);
}

let customerEat = function (restaurant, id) {
  focusCustomer(restaurant, id).eat();
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, focusCustomer(restaurant, id).orderList.length * 3 * unitTime);
  });

  let p2 = p1.then(() => {
    customerLeave(restaurant, id);
  });
}

let customerLeave = function (restaurant, id) {
  let orderList = focusCustomer(restaurant, id).orderList;

  // 获取收入
  let sumMoney = 0;
  for (let i = 0; i < orderList.length; i++) {
    // 计算成本
    sumMoney += menu[orderList[i]].price;
  }
  restaurant.cash +=  sumMoney;
  // 文字渲染 & 现金
  textDraw('cash', restaurant);

  // 顾客离座
  let p1 = new Promise((resolve, reject) => {
    // 离开动画
    domDraw('domMove', {
      left: 1000,
      top: 800,
      dom: document.getElementById('clients').getElementsByTagName('img')[emptySeat(id)]
    });
    setTimeout(function () {
      domDraw('domMove', {
        left: 1100,
        top: 20,
        dom: document.getElementById('clients').getElementsByTagName('img')[emptySeat(id)]
      });
      // 删除记录
      nameCard[emptySeat(id)] = null;
      resolve();
    }, 500);
  });

  let p2 = p1.then(() => {
    focusCustomer(restaurant, id).leave();
    restaurant.dequeue(indexCustomer(restaurant, id));
    seats--;

    if (restaurant.size() > seats) {
      let newid = restaurant.queue[seats].id;
      observer.fire('customerWait', {restaurant, id: newid});
    }
  });
  // 文字渲染 & 队列
  textDraw('queue', restaurant);
}

// 找到指定位置
let emptySeat = function (target) {
  for (let key in nameCard) {
    if (nameCard[key] == target) {
      return key;
    }
  }
}

// 根据ID找到顾客在队列的位置
let indexCustomer = function (restaurant, id) {
  for (let i = 0; i < restaurant.seats; i++) {
    if (restaurant.queue[i].id == id) {
      return i;
    }
  }
  return -1;
}

// 根据ID找到顾客
let focusCustomer = function (restaurant, id) {
  for (let i = 0; i < restaurant.seats; i++) {
    if (restaurant.queue[i].id == id) {
      return restaurant.queue[i];
    }
  }
  return null;
}

// 查找空闲的服务员
let freeWaiter = function () {
  let target = waiter.filter((value, index) => {
    if (waiterWorking[value.name]) {
      return false;
    } else {
      return true;
    }
  });
  return target[0];
}

// 判断是否有空闲的服务员
let isFreeWaiter = function () {
  let sum = 0;
  for (var key in waiterWorking) {
    sum++;
  }
  return sum != waiter.length;
}

// 查找空闲的厨师
let freeChef = function () {
  let target = chef.filter((value, index) => {
    if (chefWorking[value.name]) {
      return false;
    } else {
      return true;
    }
  });
  return target[0];
}

// 判断是否有空闲的厨师
let isFreeChef = function () {
  let sum = 0;
  for (var key in chefWorking) {
    sum++;
  }
  return sum != chef.length;
}

export default observerFlow;