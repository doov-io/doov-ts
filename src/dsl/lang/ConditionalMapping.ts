import { BooleanFunction } from 'dsl/lang/BooleanFunction';
import { Metadata } from 'dsl/meta/Metadata';
import { Context } from 'dsl/Context';
import { MappingRule } from 'dsl/lang/MappingRule';
import { ConditionalMappingMetadata } from 'dsl/meta/ConditionalMappingMetadata';
import { WhenMetadata } from 'dsl/meta/WhenMetadata';
import { MultipleMappingsMetadata } from 'dsl/meta/MultipleMappingsMetadata';
import { ELSE, THEN } from 'dsl/lang/DefaultOperators';

export class ConditionalMapping implements MappingRule {
  condition: BooleanFunction;
  metadata: ConditionalMappingMetadata;
  mappings: MappingRule[];
  elseMappings?: MappingRule[];

  constructor(condition: BooleanFunction, ...mappings: MappingRule[]) {
    this.condition = condition;
    this.mappings = mappings;
    const map: Metadata[] = mappings.map(m => m.metadata);
    this.metadata = new ConditionalMappingMetadata(
      new WhenMetadata(condition.metadata),
      new MultipleMappingsMetadata(map, THEN)
    );
  }

  execute<M extends object>(model: M, ctx?: Context): M {
    if (this.condition.get(model, ctx)) {
      return this.mappings.reduce((mdl, mapping) => mapping.execute(mdl, ctx), model);
    } else if (this.elseMappings) {
      return this.elseMappings.reduce((mdl, mapping) => mapping.execute(mdl, ctx), model);
    } else {
      return model;
    }
  }

  otherwise(...mappings: MappingRule[]): this {
    this.elseMappings = mappings;
    const map: Metadata[] = mappings.map(m => m.metadata);
    this.metadata = new ConditionalMappingMetadata(
      this.metadata.whenMetadata,
      this.metadata.thenMetadata,
      new MultipleMappingsMetadata(map, ELSE)
    );
    return this;
  }
}
