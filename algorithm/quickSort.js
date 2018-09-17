/**
 * 快速排序
 */

let arr = [3, 14, 34, 12, 51, 5, 23, 62, 13, 66, 83, 99, 1];

const quickSort = (left, right) => {
  let i, j, temp;

  if (left > right) return;

  temp = arr[left];  // 基准数
  i = left;
  j = right;

  while (i != j) {
    // 先从右向左
    while (arr[j] >= temp && i < j) j--;
    // 再从左向右
    while (arr[i] <= temp && i < j) i++;

    // 交换两个数的位置
    if (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // 最终将基准数归位  
  [arr[left], arr[i]] = [arr[i], temp];

  quickSort(left, i - 1);
  quickSort(j + 1, right);
}

quickSort(0, arr.length - 1);

console.log(arr);

