import { Metadata } from './Metadata';
import { Operator } from '../Operator';
import { AbstractMetadata } from './AbstractMetadata';

export class UnaryMetadata extends AbstractMetadata {
  readonly type = 'UNARY';
  readonly operator: Operator;
  readonly metadata: Metadata;

  public constructor(metadata: Metadata, operator: Operator) {
    super();
    this.metadata = metadata;
    this.operator = operator;
  }

  get readable(): string {
    return this.metadata.readable + ' ' + this.operator.readable;
  }

  children(): Metadata[] {
    return [this.metadata];
  }
}
