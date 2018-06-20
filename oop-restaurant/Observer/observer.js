let Observer = (function () {
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
})();

// Observer.regist('text', function (e) {
//   console.log(e.type, e.args.msg);
// })

// Observer.fire('text', {msg: '传递参数'});


/*

// 外观模式 简化获取元素
function $(id) {
  return document.getElementById(id);
}

// 工程师A
(function () {
  // 追加一则消息
  function addMsgItem (e) {
    let text = e.args.text;  // 获取消息中用户添加的文本内容
    let ul = $('msg');  // 留言容器元素
    let li = document.createElement('li');  // 创建内容容器元素
    let span = document.createElement('span');  // 删除按钮
    li.innerHTML = text;  // 写入评论
    span.onclick = function () {
      ul.remove(li);
      // 发布删除留言消息
      Observer.fire('removeCommentMessage', {
        num : -1
      });
    }
    // 添加删除按钮
    li.appendChild(span);
    // 添加留言节点
    ul.appendChild(li);
  }
  // 注册添加评论信息
  Observer.regist('addCommentMessage', addMsgItem);
})();

// 工程师B
(function () {
  // 更改用户消息数目
  function changeMsgNum (e) {
    // 获取需要增加的用户消息数目
    let num = e.args.num;
    // 增加用户消息数目并写入页面中
    $('msg_num').innerHTML = parseInt($('msg_num').innerHTML) + num;
  }
  // 注册添加评论信息
  Observer
    .regist('addCommentMessage', changeMsgNum)
    .regist('removeCommentMessage', changeMesNum);
})();

// 工程师C
(function () {
  // 用户点击提交按钮
  $('user_submit').onclick = function () {
    // 用户点击提交按钮
    let text = $('user_input');
    // 如果消息为空则提交失败
    if (text.value === '') {
      return;
    }
    // 发布一则评论消息
    Observer.fire('addCommentMessage', {
      text : text.value,  // 消息评论内容
      num : 1  // 消息评论数目
    });
    text.value = '';  // 将输入框置为空
  }
})

 */

// 学生类
let Student = function (result) {
  let that = this;
  that.result = result;
  that.say = function () {
    console.log(that.result);
  }
}
Student.prototype.answer = function (question) {
  Observer.regist(question, this.say);
}
Student.prototype.sleep = function (question) {
  console.log(this.result + ' ' + question + ' 已被注销');
  Observer.remove(question, this.say);
}

// 老师类
let Teacher = function () { };
Teacher.prototype.ask = function (question) {
  console.log('问题是：' + question);
  Observer.fire(question);
}

// 实例化学生类
let student1 = new Student('学生1回答问题');
let student2 = new Student('学生2回答问题');
let student3 = new Student('学生3回答问题');

// 三位同学订阅（监听）了老师提的问题
student1.answer('什么是设计模式');
student1.answer('简述观察者模式');
student2.answer('什么是设计模式');
student3.answer('什么是设计模式');
student3.answer('简述观察者模式');

// 后来第三位同学睡着了
student3.sleep('简述观察者模式');

// 实例化教师类
let teacher = new Teacher();

// 提了两个问题
teacher.ask('什么是设计模式');
teacher.ask('简述观察者模式');



