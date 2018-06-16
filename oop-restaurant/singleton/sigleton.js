'use strict'
// ===== 单例demo1 ===== //
/*
let Sigleton = (function () {
  // 默认为空，用于判断是否已实例化
  let instance = null;
  function init () {
    return {
      publicMethod: function () {
        console.log("Hello World!");
      },
      publicProperty: "v1.0"
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  }
})();

Sigleton.getInstance().publicMethod();
 */


// ===== 单例demo2 ===== //
/*
let Sigleton = (function () {
  let instance = null;
  function SupportClass (args) {
    var args = args || {};
    this.name = args.name || "Coyeah";
    this.id = args.id || 123456;
    //检验单例模式
    console.log('this is created!');
  };

  SupportClass.prototype = {
    constructor: SupportClass,
    displayInfo: function () {
      console.log("name: " + this.name + " | id: " + this.id);
    }
  };

  return {
    // 类的名字
    name: 'SupportClass',
    getInstance: function (args) {
      if (instance === null) {
        instance = new SupportClass(args);
      }
      return instance;
    }
  }
})();

// 调用两次方法，只会被实例一次
Sigleton.getInstance();
Sigleton.getInstance();
 */


// ===== 单例demo3 ===== //
/*
function Sigleton (args) {
  if (typeof Sigleton.instance === 'object') {
    return Sigleton.instance;
  }

  var args = args || {};
  this.name = args.name || "Coyeah";
  this.id = args.id || 123456;
  Sigleton.instance = this;
}

Sigleton.prototype = {
  constructor: Sigleton,
  displayInfo: function () {
    console.log("name: " + this.name + " | id: " + this.id);
  }
}
 */


// ===== 单例demo4 ===== //
/*
function Sigleton (args) {
  var instance = null;
  var args = args || {};
  this.name = args.name || "Coyeah";
  this.id = args.id || 123456;
  // 将instance引用创建的实例this
  instance = this;
  // 重写构造函数
  Sigleton = function () {
    return instance;
  }
};

Sigleton.prototype = {
  constructor: Sigleton,
  displayInfo: function () {
    console.log("name: " + this.name + " | id: " + this.id);
  }
}
 */


// // ===== 单例demo5 独立对象交互 ===== //
// let cat = (function (args) {
//   let instance;
//   let letterBox = function (msg) {
//     this.letter = msg;
//   }
//   let info = {
//     sendLetter: function (msg) {
//       if (!instance) {
//         instance = new letterBox(msg);
//       }
//       return instance;
//     }
//   }
//   return info;
// })();

// let dog = {
//   callCat: function (msg) {
//     let _xw = cat.sendLetter(msg);
//     console.log(_xw.letter);
//     _xw = null;
//   }
// }

// dog.callCat("Hello World!");