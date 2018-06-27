// index.js
// class
import Restaurant from './class/Restaurant.js';
import { Waiter, Chef } from './class/Staff.js';
import Customer from './class/Customer.js';
import Dishes from './class/Dishes.js';

// action
import observerFlow from './action/observerFlow.js';

// 创建菜单
const menu = (function () {
  let fish = new Dishes("fish", 10, 25, 3);
  let tofu = new Dishes("tofu", 20, 34, 5);
  let chicken = new Dishes("chicken", 12, 28, 6);
  let dumplings = new Dishes("dumplings", 22, 42, 2);
  let rice = new Dishes("rice", 2, 5, 1);
  let cabbage = new Dishes("cabbage", 16, 32, 5);
  let beef = new Dishes("beef", 6, 22, 8);
  let salad = new Dishes("salad", 14, 31, 4);
  let sandwich = new Dishes("sandwich", 21, 48, 5);
  let bacon = new Dishes("bacon", 11, 29, 2);

  return [fish, tofu, chicken, dumplings, rice, cabbage, beef, salad, sandwich, bacon];
})();

// // 实例化员工
// const waiter1 = new Waiter("Lily", 8000, 101, "waiter");
// const waiter2 = new Waiter("Ben", 8000, 101, "waiter");
// const chef1 = new Chef("Tony", 10000, 102, "chef");
// const chef2 = new Chef("Anmy", 10000, 102, "chef");

// 实例化餐厅
const IFERestaurant = new Restaurant({
    cash: 10000,
    seats: 10,
    staff: [],
    queue: [],
    repast: [],
    menu: menu
});

let operate = document.getElementById('operate');
let time = operate.getElementsByTagName('p')[0];

observerFlow(IFERestaurant);

console.log(IFERestaurant);

(function timeLoop () {
  let date = new Date();
  time.innerHTML = date.toLocaleTimeString();
  setTimeout(function () {
    timeLoop();
  }, 1000);
})();