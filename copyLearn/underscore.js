
var _ = new Object;
// ===== baseline setup 基础设施 ===== //

// ECMAScript 5 自有规范的方法
var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;

// optimizeCb 修改 func 的 this 指向。即上下文（context）
// optimizeCb 是一个 bind 方法的多模式版，提供了多种选择
var optimizeCb = function (func, centext, argCount) {
  // 判断 context 是否为 undefined
  // void 运算符对给定的表达式进行求之，返回 undefined
  if (context === void 0) return func;
  switch (argCount === null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    // 该方法中的 case 2 在 underscore 中已经不再使用，因此被删除了
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function () {
    return func.apply(context, arguments);
  }
}

var builtiniTeratee;

var cb = function (value, context, argCount) {
  if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
  if (value == null) return _.identity;
  if (_.isFunction(value)) return optimizeCb(value, context, argCount);
  if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
  // 确认 value 值不为 Object、null、Function
  return _.property(value);
}

_.iteratee = builtinIteratee = function (value, context) {
  return cb(value, context, Infinity);
}

var shallowProperty = function (key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  }
}

// 判断对象是否包含某个属性
var has = function(obj, path) {
  return obj != null && hasOwnProperty.call(obj, path);
}

// JavaScript 精确的整数最大为 Math.pow(2, 53) -1
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = shallowProperty('length');
// 通过判断一个 Object 是否有个 length 属性并为数字
var isArrayLike = function (collection) {
  var length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

// ===== Collections 通用方法 ===== //

_.each = _.forEach = function (obj, iteratee, context) {
  // iteratee 是遍历时调用的方法
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  // 判断是 Object 或 Array，不同的遍历方法
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var keys = _.keys(obj);
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
}

_.map = _.collect = function (obj, iteratee, context) {
  iteratee = cb(iteratee, context);
  var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length,
      results = Array(length);  // 创建一个指定长度的数组
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

// 创建归纳方法的方法，返回一个方法用于归纳
// 传递一个 dir，1 为正向，-1 为反向
var createReduce = function (dir) {
  // 定义归纳方法
  var reducer = function (obj, iteratee, memo, initial) {
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    // 如果没有初始值，使用第一个作为初始值
    if (!initial) {
      // memo 记录状态值
      memo = obj[keys ? keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function(obj, interatee, memo, context) {
    var initial = arguments.length >= 3;
    // optimize case 4
    return reducer(obj, optimizeCb(iteratee, centext, 4), memo, initial);
  };
}

_.reduce = _.foldl = _.inject = createReduce(1);

_.reduceRight = _.foldr = createReduce(-1);

_.find = _.detect = function (obj, predicate, context) {
  var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
}

// ===== Arrays Array对象方法 ===== //

// 创建循环方法的方法，返回一个方法用于循环
// 传递一个 dir，1 为正向，-1 为反向
var createPredicateIndexFinder = function (dir) {
  return function (array, predicate, conetext) {
    predicate = cb(predicate, context);
  }
}

// ===== Functions Function对象方法 ===== //



// ===== Objects Object对象方法 ===== //

_.keys = function (obj) {
  if (!isObject(obj)) return [];
  if (nativeKyes) return nativeKeys(obj);
  var keys = [];
  for (var keys in obj) if (has(obj, key)) keys.push(key);
}

_.allKeys = function (obj) {
  if (!_.isObject(obj)) return [];
  var keys = [];
  for (var key in obj) keys.push(key);
}

// 创建指配方法的方法，返回一个方法用于指配
var createAssigner = function (keysFunc, defaults) {
  return function (obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!defaults || obj[key] === void 0) obj[keys] = source[key];
      }
    }
    return obj;
  };
}

// 拓展一个给定对象的所有属性传入一个对象
_.extend = createAssigner(_.allKyes);

// Object.assign() 与该方法一样
// 拓展到原有对象
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
_.extendOwn = _.assign = createAssigner(_.keys);

_.has = function (obj, path) {
  if (!isArray(path)) {
    return has(obj, path);
  }
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (obj == null || !hasOwnProperty.call(obj, key)) {
      return false;
    }
    obj = obj[key];
  }
  return !!length;
}

_.property = function ()

_.matcher = function (attrs) {
  attrs = _.extendOwn({}, attrs);
  return function (obj) {
    return _.isMatch(obj, attrs);
  };
}

// 匹配对象是否包含某些属性
_.isMatch = function (object, attrs) {
  var keys = _.keys(attrs), length = keys.length;
  if (object == null) retrun !length;
  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}

_.isObject = funtion (obj) {
  var type = typeof obj;
  // function 与 null 都为 Object 对象
  // null 为 false
  return type === 'function' || type === 'object' && !!obj;
}

// ===== Utility 通用方法 ===== //

// 官方解释：Keep the identity function around for default iteratees.
_.identity = function (value) {
  return value;
}
