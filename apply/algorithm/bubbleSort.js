/**
 * 冒泡排序
 */

let arr = [3, 14, 34, 12, 51, 5, 23, 62, 13, 66, 83, 99, 1];

const bubbleSort = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort(arr));