// underscore 的源码学习，当中的 $ 即 _。
// 详细内容查看 underscore 官方网站，https://underscorejs.org/

(function () {
  // 创建根对象
  // global：Node 的全局对象
  // window/self/this：browser 的全局对象
  // this：在一些虚拟机中的全局对象为 this
  // * self 代替 window 是为了支持 Web worker
  var root = typeof self == 'object' && self.self === self &&  self ||
            typeof gboal == 'object' && global.global === global && global ||
            this ||
            {};

  // 声明一个变量 $ 的初始值，即被覆盖前的值
  var previousUnderscore = root.$;

  // 声明内置对象原型，保存小版本，便于快速使用
  var ArrayProto = Array.prototype, ObjectProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // 声明变量关于内置对象原型中常用的方法，便于快速使用
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjectProto.toString,
      hasOwnProperty = ObjectProto.hasOwnProperty;

  // 声明 ECMAScript 5 中的相关函数
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // 为 surrogate-prototype-swapping 保存裸函数
  // ?
  var Ctor = function () {};

  // 创建一个 $ 对象
  var $ = function (obj) {
    // obj instanceof other => 比较 obj 对象的 _proto_ 是否等同于 other.prototype
    // instanceof 判断实例是否属于该构造函数
    // obj 若在 $ 的原型链上，则原值返回
    if (obj instanceof $) return obj;
    // ?
    if (!(this instanceof $)) return $(obj);
    // ?
    this._wrapped = obj;
  }

  // 针对宿主环境不同，对不同的对象进行赋值
  if (typeof exports != 'undefined' && !exports.nodeType) {  // node
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = $;
    } else {
      exports.$ = $;
    }
  } else {  // browser
    root.$ = $;
  }

  // 版本号
  $.VERSION = '1.9.1';

  // 方法





  // 添加一个 chain（链式）方法，支持链式调用
  $.chain = function (obj) {
    var instance = $(obj);
    instance._chain = true;
    return instance;
  }

  // 判断 $.chain 是否被调用。
  // 若 true，返回一个被包装的对象，否则返回对象本身
  var chainResult = function (instance, obj) {
    return instance._chain ? $(obj).chain() : obj;
  }


})();

// module.exports = $;
