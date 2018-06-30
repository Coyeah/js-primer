// domDraw.js
let get = function (id) {
  return document.getElementById(id);
}

let clients = get("clients");
let worker = get("worker");
let customerSrc = './image/customer.png';
let waiterSrc = './image/waiter.png';
let chefSrc = './image/chef.png';

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
    case 'addWorker': {
      let str = '';
      if (obj.type) {
        let style = 'left:500px;top:' + obj.top + 'px;';
        str = '<img style="' + style + '" src="' + waiterSrc + '" />';
        worker.innerHTML += str;
      } else {
        let style = 'left:190px;top:' + obj.top + 'px;';
        str = '<img style="' + style + '" src="' + chefSrc + '" />';
        worker.innerHTML = str + worker.innerHTML;
      }
      break;
    }
    case 'delWorker': {
      let arr = worker.innerHTML.split('>');
      if (obj.type) {
        arr = arr.slice(0, arr.length - 2);
        arr.push("");
      } else {
        arr.shift();
      }
      console.log(arr);
      let str = arr.join('>');
      worker.innerHTML = str;
    }
  }
}

export default domDraw;