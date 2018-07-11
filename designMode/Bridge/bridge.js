// bridge.js

// 添加事件交互
let spans = document.getElementsByTagName('span');

// spans[0].onmouseover = function () {
//   this.style.color = 'red';
//   this.style.background = '#ddd';
// }
// spans[0].onmouseout = function () {
//   this.style.color = '#000';
//   this.style.background = '#fff';
// }

// spans[1].onmouseover = function () {
//   this.getElementsByTagName('strong')[0].style.color = 'green';
//   this.getElementsByTagName('strong')[0].style.background = '#ddd';
// }
// spans[1].onmouseout = function () {
//   this.getElementsByTagName('strong')[0].style.color = '#000';
//   this.getElementsByTagName('strong')[0].style.background = '#fff';
// }

// spans[2].onmouseover = function () {
//   this.getElementsByTagName('strong')[0].style.color = 'blue';
//   this.getElementsByTagName('strong')[0].style.background = '#ddd';
// }
// spans[2].onmouseout = function () {
//   this.getElementsByTagName('strong')[0].style.color = '#000';
//   this.getElementsByTagName('strong')[0].style.background = '#fff';
// }

// 提取共同点
// 抽象
function changeColor (dom, color, bg) {
  dom.style.color = color;
  dom.style.background = bg;
}

// 事件与业务逻辑之间的桥梁
spans[0].onmouseover = function () {
  changeColor(this, 'red', '#ddd');
}
spans[0].onmouseout = function () {
  changeColor(this, '#000', '#fff');
}

spans[1].onmouseover = function () {
  changeColor(this.getElementsByTagName('strong')[0], 'green', '#ddd');
}
spans[1].onmouseout = function () {
  changeColor(this.getElementsByTagName('strong')[0], '#000', '#fff');
}

spans[2].onmouseover = function () {
  changeColor(this.getElementsByTagName('strong')[0], 'blue', '#ddd');
}
spans[2].onmouseout = function () {
  changeColor(this.getElementsByTagName('strong')[0], '#000', '#fff');
}

// 多元化对象
// 多维变量类
// 运动单位
function Speed (x, y) {
  this.x = x;
  this.y = y;
}

Speed.prototype.run = function () {
  console.log("开始运动");
}

// 着色单位
function Color (cl) {
  this.color = cl;
}

Color.prototype.draw = function () {
  console.log('绘制颜色');
}

// 变形单位
function Shape (sp) {
  this.shape = sp;
}

Shape.prototype.change = function () {
  console.log('改变形状');
}

// 说话单元
function Speek (wd) {
  this.word = wd;
}

Speek.prototype.say = function () {
  console.log('书写字体');
}

// 球类 & 可以运动以及着色
function Ball (x, y, c) {
  // 实现运动单元
  this.speed = new Speed(x, y);
  // 实现着色单元
  this.color = new Color(c);
}

Ball.prototype.init = function () {
  // 实现运动
  this.speed.run();
  // 实现着色
  this.color.draw();
}

// 人物类 & 可以运动以及说话
function People (x, y, f) {
  this.speed = new Speed(x, y);
  this.font = new Speek(f);
}

People.prototype.init = function () {
  this.speed.run();
  this.font.say();
}

// 精灵类 & 可以运动以及着色以及改变形状
function Spirite (x, y, c, s) {
  this.speed = new Speed(x, y);
  this.color = new Color(c);
  this.shape = new Shape(s);
}

Spirite.prototype.init = function () {
  this.speed.run();
  this.color.draw();
  this.shape.change();
}

// 实例
let p = new People(10, 12, 16);
p.init();


