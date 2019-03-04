// 利用 Map 数据结构去重
function unique (arr) {
  let map = new Map();
  let array = new Array();
  for (let i = 0; i < arr.length; i++) {
    if (map.has(arr[i])) {
      map.set(arr[i], true);
    } else {
      map.set(arr[i], false);
      array.push(arr[i]);
    }
  }
  return array;
}

let arr = [ 1, 1, true, true, 'false', 'false', false, false, 12, 15, undefined, {}, 15, {}, 'a', 'NaN', NaN, 0, 0, null, null, undefined, NaN ];

console.log(unique(arr));
//[ 1, true, 'false', false, 12, 15, undefined, {}, {}, 'a', 'NaN', NaN, 0, null ]
