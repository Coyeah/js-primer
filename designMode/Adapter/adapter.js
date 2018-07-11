// adapter.js

/*
  JQuery适配器  
 */

// 定义框架
var A = A || {};
// 通过ID获取元素
A.g = function (id) {
  return document.getElementById(id);
}
// 为元素绑定事件
A.on = function (id, type, fn) {
  // 如果传递参数是字符串则以id处理，否则以元素对象处理
  let dom = typeof id === 'string' ? this.g(id) : id;
  // 标准DOM2级添加事件方式
  if (dom.addEventListener) {
    dom.addEventListener(type, fn, false);
  // IE DOM2级添加事件方式
  } else if (dom.attachEvent) {
    dom.attachEvent('on' + type, fn);
  // 简易添加事件方式
  } else {
    dom['on' + type] = fn;
  }
}

// 引入JQuery
A.g = function (id) {
  // 通过JQuery获取JQuery对象，然后返回第一个成员
  return $(id).get(0);
}
A.on = function (id, type, fn) {
  // 如果传递参数是字符串则以id处理，否则以元素对象处理
  let dom = typeof id === 'string' ? $('#' + id) : $(id);
  dom.on(type, fn);
}

// 窗口加载完成事件
A.on (window, 'load', function () {
  // 按钮点击事件
  A.on ('mybutton', 'click', function () {
      // do something
      console.log('click button');
  })  
})

/*
  参数适配器
 */

function doSomeThing (obj) {
  var _adapter = {
    name : 'Coyeah',
    title : 'Adapter',
    age : 21,
    color : 'gray',
    size : 100,
    prize : 20
  };

  for (let i in _adapter) {
    _adapter[i] = obj[i] || _adapter[i];
  }

  // do things
}

/*
  数据适配器
 */

let arr = ['JavaScript', 'book', 'Coding', '08/01'];

function arrToObjAdapter (arr) {
  return {
    name : arr[0],
    type : arr[1],
    title : arr[2],
    data : arr[3]
  }
}

let adapterData = arrToObjAdapter(arr);
console.log(adapterData);



