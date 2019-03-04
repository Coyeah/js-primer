// 利用 sort()
function unique (arr) {
  if (!Array.isArray(arr)) {
    console.error('type error!');
    return;
  }
  arr = arr.sort();
  let array = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      array.push(arr[i]);
    }
  }
  return array;
}

let arr = [ 1, 1, true, true, 'false', 'false', false, false, 12, 15, undefined, {}, 15, {}, 'a', 'NaN', NaN, 0, 0, null, null, undefined, NaN ];

console.log(unique(arr));
//[ 1, true, 'false', false, 12, 15, undefined, {}, {}, 'a', 'NaN', NaN, 0, null ]
