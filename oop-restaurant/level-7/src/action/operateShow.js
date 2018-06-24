// operate.js
let operate = document.getElementById('operate');
let cash = operate.getElementsByTagName('p')[1];
let waiting = operate.getElementsByTagName('p')[2];

let operateShow = function (restaurant) {
  cash.innerHTML = '餐厅本金：' + restaurant.cash;
  waiting.innerHTML = '排队人数：' + restaurant.size();
}

export default operateShow;