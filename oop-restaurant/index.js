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
function Waiter (id, name, salary) {
  Staff.call(this, id, name, salary);
}

Waiter.prototype = new Staff();

// ===== Cook ===== //
function Cook (id, name, salary) {
  Staff.call(this, id, name, salary);
}

Cook.prototype = new Staff();

// ===== Customer ===== //
function Customer () {
  this.order = function () {

  }
  this.eat = function () {

  }
}

// ===== Dishes ===== //
function Dishes (obj) {
  this.name = obj.name;
  this.cost = obj.cost;
  this.price = obj.price;
}


// ===== Text Demo ===== //
var byTheWay = new Restaurant({
    cash: 1000000,
    seats: 20,
    staff: []
});
console.log(byTheWay);

let newCook = new Cook(1202, "Tony", 10000);
console.log(newCook);

byTheWay.hire(newCook);
console.log(byTheWay.staff);
byTheWay.fire(newCook);
console.log(byTheWay.staff);