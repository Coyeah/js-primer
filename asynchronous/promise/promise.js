const fs = require('fs');

// 创建 Promise 容器
// 容器当中放置一个异步操作
// Promise 容器一旦创建，就开始执行里面的代码
// Promise 本身不是异步，但是内部是封装了异步任务
let p1 = new Promise(function (resolve, reject) {
  fs.readFile('./a.txt', 'utf8', function (err, data) {
    if (err) {
      // promise 失败
      // Pending => Rejected
      reject(err);
    } else {
      // promise 成功
      // Pending => Resolved
      resolve(data);
    }
  })
});

let p2 = new Promise(function (resolve, reject) {
  fs.readFile('./b.txt', 'utf8', function (err, data) {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  })
});

let p3 = new Promise(function (resolve, reject) {
  fs.readFile('./c.txt', 'utf8', function (err, data) {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  })
});

// Promise 然后（then）
// then 方法接收的 第一个参数 function 就是容器当中的 resolve 函数
//                第二个参数 function 就是容器当中的 reject 函数
p1
  .then(function (data) {
    console.log(data);

    // 当 return 一个 Promise 对象时，后续的 then 中的 第一个参数 function 会作为 p2 的 resolve 函数
    return p2;
  }, function (err) {
    console.log(err);
  })
  .then(function (data) {
    console.log(data);
    return p3;
  }, function (err) {
    console.log(err);
  })
  .then(function (data) {
    console.log(data);
  }, function (err) {
    console.log(err);
  });

// ^ Promise 异步调用的链式编程
