let viewCommand = (function () {
  let tpl = {
    // 展示图片结构模板
    product : [
      '<div>',
        '<img src="{#src#}"/>',
        '<p>{#text#}</p>',
      '</div>'
    ].join(''),
    // 展示标题结构模板
    title : [
      '<div class="title">',
        '<div calss="main">',
          '<h2>{#title#}</h2>',
          '<p>{#tips#}</p>',
        '</div>',
      '</div>'
    ].join(''),
  };

  let html = '';

  // 模版替换
  function formateString (str, obj) {
    return str.replace(/\{#(\w+)#\}/g, function (match, key) {
      return obj[key];
    })
  }

  // 方法集合
  let Action = {
    // 创建方法
    create : function (data, view) {
      if (data.length) {
        // 遍历数组
        for (let i = 0, len = data.length; i < len; i++) {
          // 将格式化之后的字符串缓存到html中
          html += formateString(tpl[view], data[i]);
        }
      } else {
        // 直接格式化字符串缓存到html中
        html += formateString(tpl[view], data);
      }
    },
    // 展示方法
    display : function (container, data, view) {
      // 如果传入数据
      if (data) {
        // 根据给定数据创建视图
        this.create(data, view);
      }
      // 展示模块
      document.getElementById(container).innerHTML = html;
      // 展示后清空缓存的字符串
      html = '';
    }
  }

  // 命令接口
  return function excute(msg) {
    // 解析命令，如果msg.param不是数组则将其转化为数组（apply方法要求第二个参数为数组）
    msg.param = Object.prototype.toString.call(msg.param) === "[object Array]" ? msg.param : [msg.param];
    // Action内部调用的方法引用this，所以此处为保证作用域this执行传入Action
    Action[msg.command].apply(Action, msg.param);
  }
})();

let productData = [
  {
    src: './image/1.jpg',
    text: 'pet1'
  },
  {
    src: './image/2.jpg',
    text: 'pet2'
  },
  {
    src: './image/3.jpg',
    text: 'pet3'
  },
  {
    src: './image/4.jpg',
    text: 'pet4'
  } 
];

let = titleData = {
  title: '动物世界',
  tips: '各种小宠物。'
}

viewCommand({
  command: 'display',
  param: ['title', titleData, 'title']
});

viewCommand({
  command: 'display',
  param: ['product', productData, 'product']
});
