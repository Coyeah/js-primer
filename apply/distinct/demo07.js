// 利用 hasOwnProperty
function unique (arr) {
  var obj = {};
  return arr.filter((value, index, arr) => {
    return obj.hasOwnProperty(typeof value + value) ? false : (obj[typeof value + value] = true);
  });
}

let arr = [ 1, 1, true, true, 'false', 'false', false, false, 12, 15, undefined, {}, 15, {}, 'a', 'NaN', NaN, 0, 0, null, null, undefined, NaN ];

console.log(unique(arr));
//[ 1, true, 'false', false, 12, 15, undefined, {}, {}, 'a', 'NaN', NaN, 0, null ]
