// ===== Restaurant ===== //
function Restaurant (obj) {
  this.cash = obj.cash;
  this.seats = obj.seats;
  this.staff = obj.staff;

  this.hire = function (newStaff) {
    this.staff.push(newStaff);
  }

  this.fire = function (oldStaff) {
    this.staff = this.staff.filter((value, index) => {
      if (value == oldStaff) {
        return false;
      } else {
        return true;
      }
    })
  }
}

// ===== Staff ===== //
function Staff (id, name, salary) {
  this.id = id;
  this.name = name;
  this.salary = salary;

  this.work = function () {

  }
}

// ===== Waiter ===== //
// function Waiter (id, name, salary) {
//   Staff.call(this, id, name, salary);
// }

// Waiter.prototype = new Staff();

function Waiter (id, name, salary) {
  let instance = null;
  Staff.call(this, id, name, salary);
  instance = this;

  Waiter = function () {
    return instance;
  }

  this.sendOrder = function (dishes) {
    console.log("Waiter get order!");
    let cook = new Cook();
    let temp = cook.sendOrder(dishes);
    if (temp === true) {
      return temp;
    }
  }
}

Waiter.prototype = new Staff();

// ===== Cook ===== //
// function Cook (id, name, salary) {
//   Staff.call(this, id, name, salary);
// }

// Cook.prototype = new Staff();

function Cook (id, name, salary) {
  let instance = null;
  Staff.call(this, id, name, salary);
  instance = this;

  Cook = function () {
    return instance;
  }

  this.sendOrder = function (dishes) {
    console.log("Cook get order!");
    console.log("Cooking the " + dishes + "...");
    console.log("Cook finish the order!");
    return true;
  }


}

Cook.prototype = new Staff();

// ===== Customer ===== //
function Customer () {
  let instance = this;

  this.order = function (dishes) {
    console.log("Customer ordered!");
    let waiter = new Waiter();
    let temp = waiter.sendOrder(dishes);
    if (temp === true) {
      instance.eat();
    }
  }
  this.eat = function () {
    console.log("Customer eating!");
  }
}

// ===== Dishes ===== //
function Dishes (obj) {
  this.name = obj.name;
  this.cost = obj.cost;
  this.price = obj.price;
}


// ===== Text Demo ===== //
// var byTheWay = new Restaurant({
//     cash: 1000000,
//     seats: 20,
//     staff: []
// });
// console.log(byTheWay);

// let newCook = new Cook(1202, "Tony", 10000);
// console.log(newCook);

// byTheWay.hire(newCook);
// console.log(byTheWay.staff);
// byTheWay.fire(newCook);
// console.log(byTheWay.staff);

// let newWaiter = new Waiter(1203, "Ben", 5000);
// let againWaiter = new Waiter(1204, "Lily", 1000);
// let lastWaiter = new Waiter();
// console.log(newWaiter);
// console.log(againWaiter);
// console.log(lastWaiter);



// ===== Actual Operation ===== //
let superRestaurant = new Restaurant({
  cash: 100000,
  seats: 20,
  staff: []
});

let cookTony = new Cook(101, "Tony", 3000);
let waiterBen = new Waiter(102, "Ben", 2000);

superRestaurant.hire(cookTony);
superRestaurant.hire(waiterBen);

console.log(superRestaurant);


for (let i = 0; i < 10; i++) {
  let tempC = new Customer();
  console.log("Customer" + i + " in----------");
  tempC.order("chips");
  console.log("Customer" + i + " out----------");
}