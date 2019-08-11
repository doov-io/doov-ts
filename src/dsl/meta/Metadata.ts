import { Readable } from 'dsl/Readable';
import { Operator } from 'dsl/Operator';

export type MetadataType =
  | 'WHEN'
  | 'VALIDATION'
  | 'VALUE'
  | 'FIELD'
  | 'ITERABLE_VALUE'
  | 'ITERABLE'
  | 'UNARY'
  | 'BINARY'
  | 'NARY'
  | 'SINGLE_MAPPING'
  | 'MULTIPLE_MAPPING'
  | 'CONDITIONAL_MAPPING'
  | 'FUNCTION';

export interface Metadata extends Readable {
  readonly type: MetadataType;
  readonly operator?: Operator;
  readonly readable: string;

  children?(): Metadata[];
}