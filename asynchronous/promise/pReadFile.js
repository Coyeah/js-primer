/*
封装 readFile 的 Promise 版本
 */

const fs = require('fs');

function pReadFile (filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

pReadFile('./a.txt')
  .then(function (data) {
    console.log(data);
    return pReadFile('./b.txt');
  })
  .then(function (data) {
    console.log(data);
    return pReadFile('./c.txt');
  })
  .then(function (data) {
    console.log(data);
  });
