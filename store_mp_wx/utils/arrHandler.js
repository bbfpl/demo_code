export function getArrItemByKey(arr, key, val) {
  for (let k of arr) {
    if (k[key] === val) {
      return k
    }
  }
}