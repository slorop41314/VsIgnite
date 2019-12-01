import { equals } from "ramda";

export function arrayEqual(arr1: any[], arr2: any[]) {
  return equals(new Set(arr1), new Set(arr2))
}