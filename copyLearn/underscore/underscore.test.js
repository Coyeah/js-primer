var _ = require('./underscore.js');
var $ = require('./underscore.copy.js');

console.log('===== start =====');

console.log($);

_.map([1,2,3,4,5,6], function (value) {
  console.log(value);
})

console.log('====== end ======');
