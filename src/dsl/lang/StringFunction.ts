import { Context } from 'dsl/Context';
import { ContextAccessor } from 'dsl/ContextAccessor';
import { BooleanFunction } from 'dsl/lang/BooleanFunction';
import { NumberFunction } from 'dsl/lang/NumberFunction';
import { condition, Function } from 'dsl/lang/Function';
import { BinaryMetadata } from 'dsl/meta/BinaryMetadata';
import {
  AND,
  AS_INT,
  CONCAT,
  CONTAINS,
  ENDS_WITH,
  LENGTH,
  LOWER_CASE,
  MATCHES,
  REPLACE_ALL,
  STARTS_WITH,
  SUB_STRING,
  TRIM,
  UPPER_CASE,
} from 'dsl/lang/DefaultOperators';
import { ValueMetadata } from 'dsl/meta/ValueMetadata';
import { UnaryMetadata } from 'dsl/meta/UnaryMetadata';

export class StringFunction extends Function<string> {
  public static string(accessor: ContextAccessor<object, Context, string>): StringFunction {
    return new StringFunction(accessor.metadata, accessor.get, accessor.set);
  }

  public contains(value: string | StringFunction): BooleanFunction {
    const predicate = (value: string, str: string) => value.includes(str);
    if (value instanceof StringFunction) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, CONTAINS, value.metadata),
        condition(this, value, predicate, false)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, CONTAINS, new ValueMetadata(value)),
        condition(this, value, predicate, false)
      );
    }
  }

  public matches(regex: string | StringFunction): BooleanFunction {
    const predicate = (value: string, str: string) => {
      const match = value.match(str);
      return match != null && match.length >= 1;
    };
    if (regex instanceof StringFunction) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, MATCHES, regex.metadata),
        condition(this, regex, predicate, false)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, MATCHES, new ValueMetadata(regex)),
        condition(this, regex, predicate, false)
      );
    }
  }

  public startsWith(value: string | StringFunction): BooleanFunction {
    const predicate = (value: string, str: string) => value.startsWith(str);
    if (value instanceof StringFunction) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, STARTS_WITH, value.metadata),
        condition(this, value, predicate, false)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, STARTS_WITH, new ValueMetadata(value)),
        condition(this, value, predicate, false)
      );
    }
  }

  public endsWith(value: string | StringFunction): BooleanFunction {
    const predicate = (value: string, str: string) => value.endsWith(str);
    if (value instanceof StringFunction) {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, ENDS_WITH, value.metadata),
        condition(this, value, predicate, false)
      );
    } else {
      return new BooleanFunction(
        new BinaryMetadata(this.metadata, ENDS_WITH, new ValueMetadata(value)),
        condition(this, value, predicate, false)
      );
    }
  }

  public length(): NumberFunction {
    return new NumberFunction(
      new UnaryMetadata(this.metadata, LENGTH),
      condition(this, undefined, (value: string, _: undefined) => value.length, 0)
    );
  }

  public parseInt(): NumberFunction {
    return new NumberFunction(
      new UnaryMetadata(this.metadata, AS_INT),
      condition(this, undefined, (value: string, _: undefined) => parseInt(value), null)
    );
  }

  public trim(): StringFunction {
    return new StringFunction(
      new UnaryMetadata(this.metadata, TRIM),
      condition(this, undefined, (value: string, _: undefined) => value.trim(), null)
    );
  }

  // TODO version Function
  public replaceAll(regex: string, replace: string): StringFunction {
    return new StringFunction(
      new BinaryMetadata(
        this.metadata,
        REPLACE_ALL,
        new BinaryMetadata(new ValueMetadata(regex), AND, new ValueMetadata(replace))
      ),
      condition(this, undefined, (value: string, _: undefined) => value.replace(regex, replace), null)
    );
  }

  // TODO version Function
  public substring(beginIndex: number, endIndex: number): StringFunction {
    return new StringFunction(
      new BinaryMetadata(
        this.metadata,
        SUB_STRING,
        new BinaryMetadata(new ValueMetadata(beginIndex), AND, new ValueMetadata(endIndex))
      ),
      condition(this, undefined, (value: string, _: undefined) => value.substring(beginIndex, endIndex), null)
    );
  }

  public localeUpperCase(): StringFunction {
    return new StringFunction(
      new UnaryMetadata(this.metadata, UPPER_CASE),
      condition(this, undefined, (value: string, _: undefined) => value.toLocaleUpperCase(), null)
    );
  }

  public localeLowerCase(): StringFunction {
    return new StringFunction(
      new UnaryMetadata(this.metadata, LOWER_CASE),
      condition(this, undefined, (value: string, _: undefined) => value.toLocaleLowerCase(), null)
    );
  }

  // TODO handle case when value function returns null
  public concat(value: string | StringFunction): StringFunction {
    if (value instanceof StringFunction) {
      return new StringFunction(
        new BinaryMetadata(this.metadata, CONCAT, value.metadata),
        condition(this, value, (left: string, right: string) => left + right, null)
      );
    } else {
      return new StringFunction(
        new BinaryMetadata(this.metadata, CONCAT, new ValueMetadata(value)),
        condition(this, value, (left: string, right: string) => left + right, null)
      );
    }
  }
}
