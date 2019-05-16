import { log } from 'util';
import moment from 'moment';

export type Getter<T, C, V> = (obj: T, ctx?: C) => Promise<V>;

export type Setter<T, C, V> = (obj: T, val: V, ctx?: C) => Promise<T>;

export const doov = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    log('boop');
  }
  log('prod');
  log(moment().fromNow());
  return a + b;
};
