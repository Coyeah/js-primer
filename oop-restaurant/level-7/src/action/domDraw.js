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
      let str = '<img style="' + style + '" src="' + customerSrc + '" />';

      for (let i = 0; i < obj.amount; i++) {
        clients.innerHTML += str;
      }
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
  }
}

export default domDraw;