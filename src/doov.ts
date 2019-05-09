import { log } from './util';
import moment from 'moment';

export type Getter<T, C, V> = (obj: T, ctx?: C) => V;

export type Setter<T, C, V> = (obj: T, val: V, ctx?: C) => T;

export const doov = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    log('boop');
  }
  log('prod');
  log(moment().fromNow());
  return a + b;
};

export interface Context {
  //TODO
}

export interface ContextAccessor<T, C, V> {
  get: Getter<T, C, V>;
  set: Setter<T, C, V>;
}
