// 利用 reduce + includes
function unique (arr) {
  return arr.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);
}


let arr = [ 1, 1, true, true, 'false', 'false', false, false, 12, 15, undefined, {}, 15, {}, 'a', 'NaN', NaN, 0, 0, null, null, undefined, NaN ];

console.log(unique(arr));
//[ 1, true, 'false', false, 12, 15, undefined, {}, {}, 'a', 'NaN', NaN, 0, null ]
