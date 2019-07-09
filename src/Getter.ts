export interface Getter<T, C, V> {
  (obj: T, ctx?: C): V;
}
