// observerFlow.js
// class
import Customer from '../class/Customer.js';

// action
import Observer from './Observer.js';

let observer = Observer();

let seats = 0;
let task = [];
let info = {};
let menu = {};
let waiter, chef;
let unitTime = 1000;

let dc = 0;

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
  if (restaurant.size() < 30) {
    restaurant.enqueue();

    let date = new Date();
    let id = date.getTime();

    restaurant.queue[restaurant.size() - 1].tag(id);

    observer.fire('customerWait', {restaurant, id});

    document.getElementById('operate').getElementsByTagName('p')[2].innerHTML = '排队人数：' + (restaurant.size() - restaurant.seats + seats);

  }
  if (dc < 30) {
    dc++;
    setTimeout(() => {
      randomCustomer(restaurant);
    }, Math.floor(Math.random() * 10) * 1000);
  }
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
  let type = events.args.type;
  switch (type) {
    case 'customerOrder': {
      let id = events.args.id;
      customerOrder(restaurant, id);
      break;
    }
    case 'chefOrder': {
      let dishes = events.args.dishes;
      customerServer(restaurant, dishes);
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
  console.log(focusCustomer(restaurant, id));

  focusCustomer(restaurant, id).sitdown();
  observer.fire('waiterCalled', {restaurant, id, type: 'customerOrder'});
}

let customerOrder = function (restaurant, id) {
  let p1 = new Promise((resolve, reject) => {
    setTimeout(function () {
      let i = Math.floor(Math.random() * 5);
      for (; i > 0; i--) {
        focusCustomer(restaurant, id).order(restaurant.menu);
      }
      focusCustomer(restaurant, id).order(restaurant.menu);
      console.log('Customer ' + id + ' want ' + focusCustomer(restaurant, id).orderList);
      
      info[id] = focusCustomer(restaurant, id).orderList.length;

      resolve();
    }, 3 * unitTime);
  });

  let p2 = p1.then(() => {
    waiterOrder(restaurant, id);
  });
}

let waiterOrder = function (restaurant, id) {
  let orderList = focusCustomer(restaurant, id).orderList;

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
        amount: [id],
        name: orderList[i]
      });
    } else {
      target[0].amount.push(id);
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
    // 把烹饪好的菜品交给服务员
    observer.fire('waiterCalled', {restaurant, type: 'chefOrder', dishes: item});
    // 任务栏中是否还有需要烹饪的菜品
    if (task.length != 0) {
      chefOrder(restaurant);
    } else {
      observer.regist('chefCalled', chefRegist);
    }
  });
}

let customerServer = function (restaurant, dishes) {
  for (let i = 0; i < dishes.amount.length; i++) {
    info[dishes.amount[i]]--;
    waiter.serverDishes();

    if (info[dishes.amount[i]] == 0) {
      customerEat(restaurant, dishes.amount[i]);
      delete info[dishes.amount[i]];
    }
  }

  console.log(info);
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
  restaurant.dequeue(indexCustomer(restaurant, id));
  seats++;

  console.log('----------------------------------------------- leaving');

  if (restaurant.size() > (restaurant.seats - seats)) {
    let newid = restaurant.queue[restaurant.seats - seats].id;
    observer.fire('customerWait', {restaurant, id: newid});
  }

  document.getElementById('operate').getElementsByTagName('p')[2].innerHTML = '排队人数：' + (restaurant.size() - restaurant.seats + seats);
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

// 根据ID找到顾客
let focusCustomer = function (restaurant, id) {
  for (let i = 0; i < restaurant.seats; i++) {
    if (restaurant.queue[i].id == id) {
      return restaurant.queue[i];
    }
  }
  return null;
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

export default observerFlow;