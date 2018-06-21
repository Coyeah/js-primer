// index.js
import Restaurant from './class/Restaurant.js';
import { Waiter, Chef } from './class/Staff.js';

// 实例化餐厅
const IFERestaurant = new Restaurant({
    cash: 10000,
    seats: 10,
    staff: [],
    queue: [],
    menu: []
});

console.log(IFERestaurant);

const waiter = new Waiter("Lily", 8000, 101);
const chef = new Chef("Tony", 10000, 102);

console.log(waiter);
console.log(chef);

// console.log('test');