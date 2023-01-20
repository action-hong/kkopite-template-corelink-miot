interface P {
  did: string,
  prop: string,
  siid: number,
  piid: number
}

// union to tuple 
// https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type
// 其实也没啥必要推断出 mp这个方法的返回值的结构
// oh boy don't do this
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

export declare function p2k<K extends string, const T extends Record<K, P>>(obj: T): {
  [Key in keyof T as T[Key]['prop']]: Key
} 

export declare function mp<K extends string, const T extends Record<K, P>>(obj: T): TuplifyUnion<{
  [K in keyof T]: { key: K } & T[K]
}[keyof T]>