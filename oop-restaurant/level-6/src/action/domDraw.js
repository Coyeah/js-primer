// domDraw.js
let get = function (id) {
  return document.getElementById(id);
}

let clients = get("clients");
let customerSrc = './image/customer.png';

let domDraw = function (type, obj) {
  switch (type) {
    case 'customerCreate': {
      let style = 'left:' + 1100 + 'px;top:20px;';
      clients.innerHTML += '<img style="' + style + '" src="' + customerSrc + '" />'
      break;
    }
    case 'customerOut': {
      clients.removeChild(obj.dom);
      break;
    }
    case 'domMove': {
      obj.dom.style.left = obj.left + 'px';
      obj.dom.style.top = obj.top + 'px';
      break;
    }
    case 'cashPrint': {
      let cash = operate.getElementsByTagName('p')[0];
      cash.innerHTML = '餐厅本金：' + obj.cash;
      break;
    }
  }
}

export default domDraw;