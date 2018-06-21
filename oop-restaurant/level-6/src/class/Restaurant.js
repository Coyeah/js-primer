// restaurant.js
/*
  声明餐厅类
    属性：金钱，座位数量、职员列表
    方法：招聘职员，解雇职员
 */
/*
function Restaurant (props) {
  this.cash = props.cash;
  this.seats = props.seats;
  this.staff = props.staff;
  this.queue = props.queue;
  this.menu = props.menu;

  this.hire = function (newStaff) {
    this.staff.push(newStaff);
  }
  this.fire = function (oldStaff) {
    this.staff = this.staff.filter((value, index) => {
      if (value.id == oldStaff.id) {
        return false;
      } else {
        return true;
      }
    });
  }
}
Restaurant.prototype = {
  constructor: Restaurant,
  enqueue: function () {
    let element = new Customer();
    this.queue.push(element);
  },
  dequeue: function () {
    return this.queue.shift();
  },
  front: function () {
    return this.queue[0];
  },
  isEmpty: function () {
    return this.queue.length == 0;
  },
  size: function () {
    return this.queue.length;
  },
  clear: function () {
    this.queue = [];
  },
  print: function () {
    console.log(this.queue.toString());
  }
}
 */

class Restaurant {
  constructor (props) {
    this.cash = props.cash;
    this.seats = props.seats;
    this.staff = props.staff;
    this.queue = props.queue;
    this.menu = props.menu;
  }

  enqueue () {
    let element = new Customer();
    this.queue.push(element);
  }

  dequeue () {
    return this.queue.shift();
  }

  front () {
    return this.queue[0];
  }

  isEmpty () {
    return this.queue.length == 0;
  }

  size () {
    return this.queue.length;
  }

  clear () {
    this.queue = [];
  }

  print () {
    console.log(this.queue.toString());
  }
}

export default Restaurant;