import { Field } from 'dsl/Field';
import { Context } from 'dsl/Context';
import { ContextAccessor } from 'dsl/ContextAccessor';
import { BooleanFunction } from 'dsl/lang/BooleanFunction';
import { NumberFunction } from 'dsl/lang/NumberFunction';
import { StringFunction } from 'dsl/lang/StringFunction';
import { Function, FunctionConstructor } from 'dsl/lang/Function';
import { StepWhen } from 'dsl/lang/StepWhen';
import { StepMap } from 'dsl/lang/StepMap';
import { MappingRule } from 'dsl/lang/MappingRule';
import { Mappings } from 'dsl/lang/Mappings';
import { NaryMetadata } from 'dsl/meta/NaryMetadata';
import { MATCH_ALL, MATCH_ANY, NONE_MATCH } from 'dsl/lang/DefaultOperators';
import { BiStepMap } from 'dsl/lang/BiStepMap';
import { ConverterFunction, TypeConverter } from 'dsl/lang/TypeConverter';
import { NaryConverterFunction, NaryTypeConverter } from 'dsl/lang/NaryTypeConverter';
import { NaryStepMap } from 'dsl/lang/NaryStepMap';
import { DateFunction } from 'dsl/lang/DateFunction';

export function f<T>(accessor: ContextAccessor<object, Context, T>): Function<T> {
  return Function.function(accessor);
}

export function field<T extends object, V>(...path: (string | number)[]): Field<T, Context, V> {
  return Field.field(...path);
}

export function lift<U, F extends Function<U>>(constructor: FunctionConstructor<U, F>, value: U): F {
  return Function.lift(constructor, value);
}

export function boolean(field: Field<object, Context, boolean>): BooleanFunction {
  return BooleanFunction.boolean(field);
}

export function string(field: Field<object, Context, string>): StringFunction {
  return StringFunction.string(field);
}

export function number(field: Field<object, Context, number>): NumberFunction {
  return NumberFunction.number(field);
}

export function date(field: Field<object, Context, Date>): DateFunction {
  return DateFunction.date(field);
}

export function when(condition: BooleanFunction): StepWhen {
  return new StepWhen(condition);
}

export function map<T, U>(input: Function<T>): StepMap<T>;
export function map<T, U>(input: Function<T>, input2: Function<U>): BiStepMap<T, U>;
export function map<T, U>(input: Function<T>, input2?: Function<U>) {
  if (input2) {
    return new BiStepMap(input, input2);
  } else {
    return new StepMap(input);
  }
}

export function mapAll(...inputs: Function<any>[]): NaryStepMap {
  return new NaryStepMap(inputs);
}

export function converter<T, U, V>(
  converter: ConverterFunction<T, U, V>,
  description?: string
): TypeConverter<T, U, V> {
  return new TypeConverter(converter, description);
}

export function naryConverter<V>(converter: NaryConverterFunction<V>, description?: string): NaryTypeConverter<V> {
  return new NaryTypeConverter(converter, description);
}

export function mappings(...mappings: MappingRule[]): Mappings {
  return new Mappings(...mappings);
}

export function matchAny(...values: BooleanFunction[]): BooleanFunction {
  return new BooleanFunction(new NaryMetadata(values.map(value => value.metadata), MATCH_ANY), (obj, ctx) => {
    return values.some(value => {
      const v = value.get(obj, ctx);
      return v != null ? v : false;
    });
  });
}

export function matchAll(...values: BooleanFunction[]): BooleanFunction {
  return new BooleanFunction(new NaryMetadata(values.map(value => value.metadata), MATCH_ALL), (obj, ctx) => {
    return values.every(value => {
      const v = value.get(obj, ctx);
      return v != null ? v : false;
    });
  });
}

export function matchNone(...values: BooleanFunction[]): BooleanFunction {
  return new BooleanFunction(new NaryMetadata(values.map(value => value.metadata), NONE_MATCH), (obj, ctx) => {
    return values.every(value => {
      const v = value.get(obj, ctx);
      return v != null ? !v : false;
    });
  });
}
