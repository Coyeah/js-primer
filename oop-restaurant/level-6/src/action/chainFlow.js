// chainFlow.js
import domDraw from './domDraw.js';

const unitTime = 20;

let waiter, chef;

/*
  职责链模式
  1-获取数据
  2-分发处理数据
  3-具象化处理
 */
let chainFlow = function (restaurant) {
  waiter = getStaff(restaurant.staff, 'waiter');
  chef = getStaff(restaurant.staff, 'chef');

  dealData(restaurant, 'customerIn');
};

let dealData = function (data, type, obj) {
  switch (type) {
    case 'customerIn': {
      let restaurant = data;
      customerIn(restaurant);
      break;
    }
    case 'customerOrder': {
      let restaurant = data;
      customerOrder(restaurant);
      break;
    }
    case 'waiterOrder': {
      let restaurant = data;
      waiterOrder(restaurant);
      break;
    }
    case 'chefOrder': {
      let restaurant = data;
      let index = obj.index;
      chefOrder(restaurant, index);
      break;
    }
    case 'waiterServe': {
      let restaurant = data;
      let index = obj.index;
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

let customerIn = function (restaurant) {
  // customer draw
  // create
  let p1 = promise(domDraw, 1000, 'customerCreate');
  // in
  let p2 = p1.then(function () {
    return promise(domDraw, 500, 'domMove', {
      dom: document.getElementById('clients').getElementsByTagName('img')[0],
      top: 20,
      left: 900
    });
  });
  // order
  let p3 = p2.then(function () {
    restaurant.queue[0].sitdown();
    dealData(restaurant, 'customerOrder');
  });
}

let customerOrder = function (restaurant) {
  // customer order
  let p1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
      let i = Math.floor(Math.random() * restaurant.menu.length + 1);
      for (; i > 0; i--) {
        restaurant.queue[0].order(restaurant.menu);
      }
      dealData(restaurant, 'waiterOrder');
    }, 3 * unitTime);
  })
}

let waiterOrder = function (restaurant) {
  // waiter order to chef
  waiter[0].getOrder(restaurant.queue[0].orderList);

  // pay it
  restaurant.cash = payIt(true, restaurant, restaurant.queue[0].orderList);

  dealData(restaurant, 'chefOrder', {
    index: 0
  });
}

let chefOrder = function (restaurant, index) {
  let dishesName = restaurant.queue[0].orderList[index];
  let dishes;
  for (let i = 0; i < restaurant.menu.length; i++) {
    if (restaurant.menu[i].name == dishesName) {
      dishes = restaurant.menu[i];
      i = restaurant.menu.length;
    }
  }
  // go to kitchen
  let p1 = promise(domDraw, 500, 'domMove', {
    dom: document.getElementById('waiter'),
    top: 120,
    left: 380
  });

  // chef cooking
  let p2 = p1.then(function () {
    chef[0].cooking(dishesName);
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, dishes.unitTime * unitTime);
    });
  });

  let p3 = p2.then(function () {
    dealData(restaurant, 'waiterServe', {
      index: index
    });
  });
}

let waiterServe = function (restaurant, index) {
  waiter[0].serverDishes();

  let p1 = promise(domDraw, 500, 'domMove', {
    dom: document.getElementById('waiter'),
    top: 120,
    left: 500
  });

  let p2 = p1.then(function () {
    if (restaurant.queue[0].orderList.length == index + 1) {
      // finish
      dealData(restaurant, 'customerEat');
    } else {
      dealData(restaurant, 'chefOrder', {
        index: index + 1
      });
    }
  })
}

let customerEat = function (restaurant) {
  let p1 = new Promise(function (resolve, reject) {
    restaurant.queue[0].eat();
    setTimeout(function () {
      resolve();
    }, restaurant.queue[0].orderList.length * 3 * unitTime);
  });

  let p2 = p1.then(function () {
    dealData(restaurant, 'customerLeave');
  })
}

let customerLeave = function (restaurant) {
  restaurant.queue[0].leave();

  // pay it
  restaurant.cash = payIt(false, restaurant, restaurant.queue[0].orderList);

  let p1 = promise(domDraw, 500, 'domMove', {
    dom: document.getElementById('clients').getElementsByTagName('img')[0],
    top: 800,
    left: 900
  });

  let p2 = p1.then(function () {
    domDraw('customerOut', {
      dom: document.getElementById('clients').getElementsByTagName('img')[0],
    });
    restaurant.dequeue();
    if (!restaurant.isEmpty()) {
      dealData(restaurant, 'customerIn');
    } else {
      console.log('>> <<');
    }
  });
}

// set a promise
let promise = function (fn, time, key, obj) {
  return new Promise(function (resolve, reject) {
    fn(key, obj);
    setTimeout(function () {
      resolve();
    }, time);
  });
}

// filter the staff
let getStaff = function (obj, key) {
  return obj.filter((value, index) => {
    if (value.type == key) {
      return true;
    } else {
      return false;
    }
  });
}

// count money
let payIt = function (type, restaurant, orderList) {
  let key = {};
  let list = restaurant.menu;
  for (let i = 0; i < list.length; i++) {
    key[list[i].name] = {
      cost: list[i].cost,
      price: list[i].price
    }
  }

  let sum = 0;
  for (let i = 0; i < orderList.length; i++) {
    if (type) {
      sum -= key[orderList[i]].cost;
    } else {
      sum += key[orderList[i]].price;
    }
  }
  sum += restaurant.cash;

  domDraw('cashPrint', {
    cash: sum
  })
  return sum;
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

export default chainFlow;