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

// 实例化员工
const waiter = new Waiter("Lily", 8000, 101, "waiter");
const chef = new Chef("Tony", 10000, 102, "chef");

// 实例化餐厅
const IFERestaurant = new Restaurant({
    cash: 1000,
    seats: 10,
    staff: [waiter, chef],
    queue: [],
    repast: [],
    menu: menu
});

let operate = document.getElementById('operate');
let start = operate.getElementsByTagName('button')[0];
let time = operate.getElementsByTagName('p')[0];

start.onclick = function () {
  observerFlow(IFERestaurant);
};

console.log(IFERestaurant);

(function timeLoop () {
  let date = new Date();
  time.innerHTML = date.toLocaleTimeString();
  setTimeout(function () {
    timeLoop();
  }, 1000);
})();