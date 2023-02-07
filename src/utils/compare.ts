/**
 * @description Is two array of string are equal.
 * @param array1 
 * @param array2 
 * @returns boolean
 */
export function isSameArray(array1: string[], array2: string[]) {
  array1.sort()
  array2.sort()

  const length = array1.length > array2.length
    ? array1.length
    : array2.length

  for (var i = 0; i < length; i++) {
    if (array1[i] !== array2[i]) return false
  }

  return true
}
