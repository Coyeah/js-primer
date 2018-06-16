// 简单工厂模式
function createPop (type, text) {
  let o = new Object();
  o.content = text;
  o.show = function () {
    // 显示方法
  }
  switch (type) {
    case 'alert': {
      // 警示框差异部分
      break;
    }
    case 'prompt': {
      // 提示框差异部分
      break;
    }
    case 'confirm': {
      // 确认框差异部分
      break;
    }
  }
  return o;
}

let userNameAlert = createPop("alert", "用户名只能是26个字母和数字");
// console.log(userNameAlert);



// 工厂方法模式
// 安全模式类
let Demo = function () {
  if (!(this instanceof Demo)) {
    return new Demo();
  }
};
Demo.prototype = {
  show: function () {
    console.log('成功获取！');
  }
}
// let d = new Demo();
let d = Demo();
d.show();
// 安全的工厂方法
let Factory = function (type, content) {
  if (this instanceof Factory) {
    let s = new this[type] (content);
    return s;
  } else {
    return new Factory (type, content);
  }
}
Factory.prototype = {
  java: function (content) {
    this.content = content;
    (function (content) {
      let div = document.createElement('div');
      div.innerHTML = content;
      div.style.border = '1px solid red';
      document.getElementById('container').appendChild(div);
    })(content);
  },
  javascript: function (content) {
    this.content = content;
    (function (content) {
      let div = document.createElement('div');
      div.innerHTML = content;
      div.style.border = '1px solid yellow';
      document.getElementById('container').appendChild(div);
    })(content);
  },
  php: function (content) {
    this.content = content;
    (function (content) {
      let div = document.createElement('div');
      div.innerHTML = content;
      div.style.border = '1px solid blue';
      document.getElementById('container').appendChild(div);
    })(content);
  },
  python: function (content) {
    this.content = content;
    (function (content) {
      let div = document.createElement('div');
      div.innerHTML = content;
      div.style.border = '1px solid green';
      document.getElementById('container').appendChild(div);
    })(content);
  }
}
let data = [
  {type: 'javascript', content: 'JavaScript哪家强'},
  {type: 'java', content: 'Java哪家强'},
  {type: 'javascript', content: 'JavaScript哪家强'},
  {type: 'php', content: 'PHP哪家强'},
  {type: 'php', content: 'PHP哪家强'},
  {type: 'java', content: 'Java哪家强'},
  {type: 'python', content: 'Python哪家强'},
  {type: 'java', content: 'Java哪家强'},
  {type: 'javascript', content: 'JavaScript哪家强'},
  {type: 'python', content: 'Python哪家强'},
];
for (let i = data.length - 1; i >= 0; i--) {
  Factory(data[i].type, data[i].content);
}



// 抽象工厂模式
// 抽象工厂方法
let VehicleFactory = function (subType, superType) {
  // 判断抽象工程中是否有该抽象类
  if (typeof VehicleFactory[superType] === 'function') {
    // 缓存类
    function F() { };
    // 继承父类属性和方法
    F.prototype = new VehicleFactory[superType] ();
    // 将子类constructor指向子类
    subType.constructor = subType;
    // 子类原型继承“父类”
    subType.prototype = new F();
  } else {
    // 不存在该抽象类抛出错误
    throw new Error('未创建该抽象类');
  }
}
// 小汽车抽象类
VehicleFactory.Car = function () {
  this.type = 'car';
};
VehicleFactory.Car.prototype = {
  getPrice: function () {
    return new Error('抽象方法不能调用');
  },
  getSpeed: function () {
    return new Error('抽象方法不能调用');
  }
};
// 公交车抽象类
VehicleFactory.Bus = function () {
  this.type = 'bus';
};
VehicleFactory.Bus.prototype = {
  getPrice: function () {
    return new Error('抽象方法不能调用');
  },
  getSpeed: function () {
    return new Error('抽象方法不能调用');
  }
};
// 大货车抽象类
VehicleFactory.Truck = function () {
  this.type = 'truck';
};
VehicleFactory.Truck.prototype = {
  getPrice: function () {
    return new Error('抽象方法不能调用');
  },
  getSpeed: function () {
    return new Error('抽象方法不能调用');
  }
};
// 宝马汽车子类
let BMW = function(price, speed) {
  this.price = price;
  this.speed = speed;
}
// 抽象工厂实现对Car抽象类的继承
VehicleFactory(BMW, 'Car');
BMW.prototype.getPrice = function () {
  return this.price;
}
BMW.prototype.getSpeed = function () {
  return this.speed;
}
// 兰博基尼汽车子类
let Lamborghini = function(price, speed) {
  this.price = price;
  this.speed = speed;
}
// 抽象工厂实现对Car抽象类的继承
VehicleFactory(Lamborghini, 'Car');
BMW.prototype.getPrice = function () {
  return this.price;
}
BMW.prototype.getSpeed = function () {
  return this.speed;
}
// 宇通汽车子类
let YUTONG = function(price, passenger) {
  this.price = price;
  this.passenger = passenger;
}
// 抽象工厂实现对Bus抽象类的继承
VehicleFactory(YUTONG, 'Bus');
BMW.prototype.getPrice = function () {
  return this.price;
}
BMW.prototype.getPassengerNum = function () {
  return this.passenger;
}
// 奔驰汽车子类
let BenzTruck = function(price, trainLoad) {
  this.price = price;
  this.trainLoad = trainLoad;
}
// 抽象工厂实现对Car抽象类的继承
VehicleFactory(BenzTruck, 'Truck');
BenzTruck.prototype.getPrice = function () {
  return this.price;
}
BenzTruck.prototype.getTrainLoad = function () {
  return this.trainLoad;
}
// 实现
let truck = new BenzTruck(1000000, 1000);
console.log(truck.getPrice());
console.log(truck.getTrainLoad());
console.log(truck.type);





