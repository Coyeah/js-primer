// Observer.js
let Observer = function () {
  var _messages = {};
  return {
    // 注册信息接口
    regist : function (type, fn) {
      // 如果此消息不存在则应该创建一个该消息类型
      if (typeof _messages[type] === 'undefined') {
        // 将动作推入到该消息对应的动作执行队列中
        _messages[type] = [fn];
      } else {
        // 将动作推入该消息对应的动作执行序列中
        _messages[type].push(fn);
      }
    },
    // 发布信息接口
    fire : function (type, args) {
      // 如果该消息没有被注册，则返回
      if (!_messages[type]) {
        return;
      }
      var events = {
        type : type,  // 消息类型
        args : args || []   // 消息携带数据
      },
      i = 0,  // 消息动作循环变量
      len = _messages[type].length; // 消息动作长度
      // 遍历消息动作
      for (; i < len; i++) {
        // 依次执行注册的消息对应的动作序列
        _messages[type][i].call(this, events);
      }
    },
    // 移除信息接口
    remove : function (type, fn) {
      // 如果消息动作队列存在
      if (_messages[type] instanceof Array) {
        // 从最后一个消息动作遍历
        var i = _messages[type].length - 1;
        for (; i >= 0; i--) {
          // 如果存在改动作则在消息动作序列中移除相应动作
          _messages[type][i] === fn && _messages[type].splice(i, 1);
        }
      }
    },
  }
};

export default Observer;