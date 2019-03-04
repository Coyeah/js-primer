const data = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41];

const binarySearch = (data, key) => {
  let left = 0, right = data.length - 1, mid;
  while (left <= right) {
    mid = parseInt((left + right) / 2);
    // console.log('--->', left, right, mid);
    if (data[mid] == key) {
      return mid;
    } else if (key < data[mid]) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return -1;
}

let ts = binarySearch(data, 13);
console.log(ts, data[ts]);