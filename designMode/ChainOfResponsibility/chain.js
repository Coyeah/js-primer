// chain.js

/*
  异步请求对象（简化版本）
  参数 data —— 请求数据
  参数 dealType —— 响应数据处理对象
  参数 dom —— 事件源
 */
let sendData = function (data, dealType, dom) {
  let xhr = new XMLHttpRequest();
  let url = './userInfo.json';

  xhr.onload = function (event) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
      dealType(xhr.responseText, dealType, dom);
    } else {
      // 请求失败
    }

    // 拼接请求字符串
    for (let i in data) {
      url += '&' + i + '=' + data[i];
    }

    // 发送异步请求
    xhr.open("GET", url, true);
    xhr.send(null);
  }
}

/*
  处理响应数据
  参数 data —— 响应数据
  参数 dealType —— 响应数据处理对象
  参数 dom —— 事件源
 */
let dealData = function (data, dealType, dom) {
  // 对象 toString 方法简化引用
  let dataType = Object.prototype.toString.call(data);
  // 判断响应数据处理对象
  switch(dealType) {
    // 输入框提示功能
    case 'sug': {
      // 如果数据为数组
      if (dataType === "[object Array") {
        // 创建提示框组件
        return createSug(data, dom);
      }
      // 将响应的对象数据转化为数组
      if (dataType === "[object Object]") {
        let newData = [];
        for (let i in data) {
          newData.push(data[i]);
        }
        // 创建提示框组件
        return createSug(newData, dom);
      }
      // 将响应的其他数据转化为数组
      return createSug([data], dom);
      break;
    }
    case 'validate': {
      // 创建校验组件
      return createValidataResult(data, dom);
      break;
    }
  }
}

/*
  创建提示框组件
  参数 data —— 响应适配数据
  参数 dom —— 事件源
 */
let createSug = function (data, dom) {
  let i = 0,
    len = data.length,
    html = '';

  for (; i < len; i++) {
    html += '<li>' + data[i] + '</li>';
  }

  dom.parentNode.getElementsByTagName('ul')[0].innerHTML = html;
}

/*
  创建校验组件
  参数 data —— 响应适配数据
  参数 dom —— 事件源
 */
let createValidataResult = function (data, dom) {
  dom.parentNode.getElementsByTagName('span')[0].innerHTML = data;
}

/*
  测试
 */
let input = document.getElementsByTagName('input');

dealData('用户名不存在', 'validate', input[0]);
dealData('123', 'sug', input[1]);
dealData(['爱奇艺', '阿里巴巴', '爱漫画'], 'sug', input[1]);
dealData({
  'iqy' : '爱奇艺',
  'albb' : '阿里巴巴',
  'imh' : '爱漫画',
}, 'sug', input[1])

