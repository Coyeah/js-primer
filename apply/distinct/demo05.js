// 利用对象的属性不能相同的特点进行去重
function unique (arr) {
  if (!Array.isArray(arr)) {
    console.error('type error!');
    return;
  }
  let array = [], obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      array.push(arr[i]);
      obj[arr[i]] = 1;
    } else {
      obj[arr[i]]++;
    }
  }
  return array;
}

let arr = [ 1, 1, true, true, 'false', 'false', false, false, 12, 15, undefined, {}, 15, {}, 'a', 'NaN', NaN, 0, 0, null, null, undefined, NaN ];

console.log(unique(arr));
// [ 1, true, 'false', 12, 15, undefined, {}, 'a', 'NaN', 0, null ]
// 两个 false 直接去掉了，NaN 和 {} 去重
