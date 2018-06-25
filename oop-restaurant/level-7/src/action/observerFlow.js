// observerFlow.js
// class
import Customer from '../class/Customer.js';

// action
import Observer from './Observer.js';

let observer = Observer();

let heap = 1;
let seats = 0;
let task = [];
let menu = {};
let waiter, chef;
let unitTime = 1000;

let observerFlow = function (restaurant) {
  // init
  init(restaurant);

  // 随机生成顾客
  randomCustomer(restaurant);

}

let init = function (restaurant) {
  seats = restaurant.seats;
  menu = tidyMenu(restaurant.menu);
  waiter = getStaff('waiter', restaurant.staff)[0];
  chef = getStaff('chef', restaurant.staff)[0];

  observer.regist('customerWait', restaurantRegist);
  observer.regist('waiterCalled', waiterRegist);
  observer.regist('chefCalled', chefRegist);
}

// 随机生成顾客
let randomCustomer = function (restaurant) {
  if (restaurant.size() < 50) {
    restaurant.enqueue();
    let id = restaurant.size() + heap - 1;

    console.log(id, restaurant.size());

    observer.fire('customerWait', {restaurant, id});

    document.getElementById('operate').getElementsByTagName('p')[2].innerHTML = '排队人数：' + (restaurant.size() - restaurant.seats + seats);

  }
  setTimeout(() => {
    randomCustomer(restaurant);
  }, Math.floor(Math.random() * 10) * 1000);
}

let restaurantRegist = function (events) {
  let restaurant = events.args.restaurant;
  let id = events.args.id;
  switch (events.type) {
    case 'customerWait': {
      if (seats > 0) {
        seats--;
        customerIn(restaurant, id);
      }
    }
  }
}

let waiterRegist = function (events) {
  let restaurant = events.args.restaurant;
  let id = events.args.id;
  let type = events.args.type;

  switch (type) {
    case 'customerOrder': {
      customerOrder(restaurant, id);
      break;
    }
  }
}

let chefRegist = function (events) {
  let restaurant = events.args.restaurant;
  switch (events.type) {
    case 'chefCalled': {
      observer.remove(events.type, chefRegist);
      chefOrder(restaurant);
      break;
    }
  }
}

let customerIn = function (restaurant, id) {
  restaurant.queue[id - heap].sitdown();
  observer.fire('waiterCalled', {restaurant, id, type: 'customerOrder'});
}

let customerOrder = function (restaurant, id) {
  let p1 = new Promise((resolve, reject) => {
    setTimeout(function () {
      let i = Math.floor(Math.random() * 5);
      for (; i > 0; i--) {
        restaurant.queue[id - heap].order(restaurant.menu);
      }
      restaurant.queue[id - heap].order(restaurant.menu);
      // console.log('Customer ' + id + ' want ' + restaurant.queue[id - heap].orderList);
      
      resolve();
    }, 3 * unitTime);
  });

  let p2 = p1.then(() => {
    waiterOrder(restaurant, id);
  });
}

let waiterOrder = function (restaurant, id) {
  let orderList = restaurant.queue[id - heap].orderList;

  for (let i = 0; i < orderList.length; i++) {
    let target = task.filter((value, index) => {
      if (value.name == orderList[i]) {
        return true;
      } else {
        return false;
      }
    });
    if (target.length == 0) {
      task.push({
        amount: 1,
        name: orderList[i]
      });
    } else {
      target[0].amount++;
    }
  }

  observer.fire('chefCalled', {restaurant});
}

let chefOrder = function (restaurant) {
  let item = task.shift();
  chef.cooking(item);
  console.log(task);

  // 烹饪中
  let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, menu[item.name].unitTime * unitTime);
  });

  // 烹饪后
  let p2 = p1.then(() => {
    // 任务栏中是否还有需要烹饪的菜品
    if (task.length != 0) {
      chefOrder(restaurant);
    } else {
      observer.regist('chefCalled', chefRegist);
    }
  });
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

export default observerFlow;