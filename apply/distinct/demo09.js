// 利用递归去重
function unique (arr) {
  let array = arr, len = array.length;

  array.sort(function (a, b) {
    return a - b;
  });

  function loop (index) {
    if (index >= 1) {
      if (array[index] === array[index - 1]) {
        array.splice(index, 1);
      }
      loop(index - 1);
    }
  }
  loop(len - 1);
  return array;
}

let arr = [ 1, 1, true, true, 'false', 'false', false, false, 12, 15, undefined, {}, 15, {}, 'a', 'NaN', NaN, 0, 0, null, null, undefined, NaN ];

console.log(unique(arr));
//[ 1, true, 'false', false, 12, 15, undefined, {}, {}, 'a', 'NaN', NaN, 0, null ]
