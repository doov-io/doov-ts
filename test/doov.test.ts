import { Model, User } from './model';
import { Field } from '../src/Field';
import { StringFunction } from '../src/StringFunction';
import { BooleanFunction } from '../src/BooleanFunction';
import * as DOOV from '../src/doov';

let model: Model;
let user: User;

const name = StringFunction.string(Field.field<Model, string>('user', 'name'));
const a = BooleanFunction.boolean(Field.field<Model, boolean>('user', 'b'));
const id = DOOV.number(Field.field<Model, number>('user', 'id'));
const link1 = DOOV.string(Field.field<Model, string>('user', 'links', 0));
const link2 = DOOV.string(Field.field<Model, string>('user', 'links', 1));

beforeEach(() => {
  model = new Model();
  user = new User(1);
  user.name = 'test';
  user.b = true;
  model.user = user;
});

describe('doov match all', () => {
  it('match all true', () => {
    expect(DOOV.matchAll(name.eq('test'), a.eq(true)).get(model)).toEqual(true);
  });

  it('match all false', () => {
    expect(DOOV.matchAll(name.eq('other'), a.eq(true)).get(model)).toEqual(false);
  });
});

describe('doov match any', () => {
  it('match any true', () => {
    expect(DOOV.matchAny(name.eq('test'), a.eq(false)).get(model)).toEqual(true);
  });

  it('match any false', () => {
    expect(DOOV.matchAny(name.eq('other'), a.eq(false)).get(model)).toEqual(false);
  });
});

describe('doov none match', () => {
  it('none match true', () => {
    expect(DOOV.matchNone(name.eq('other'), a.eq(false)).get(model)).toEqual(true);
  });

  it('none match false', () => {
    expect(DOOV.matchNone(name.eq('test'), a.eq(false)).get(model)).toEqual(false);
  });
});

describe('doov when', () => {
  it('when validate execute result true', () => {
    const result = DOOV.when(name.eq('test'))
      .validate()
      .execute(model);
    expect(result.value).toEqual(true);
  });

  it('when validate execute result false', () => {
    const result = DOOV.when(DOOV.matchNone(name.eq('test'), a.eq(false)))
      .validate()
      .execute(model);
    expect(result.value).toEqual(false);
  });
});

describe('doov map', () => {
  it('map to execute', () => {
    const stringMapping = DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1);
    model = stringMapping.execute(model);
    expect(link1.get(model)).toEqual('link of 1');
  });

  it('map to execute', () => {
    const stringMapping = DOOV.map(name).to(link2);
    model = stringMapping.execute(model);
    expect(link2.get(model)).toEqual('test');
  });

  it('when validate execute result false', () => {
    const booleanMapping = DOOV.map(DOOV.matchNone(name.eq('test'), a.eq(false))).to(a);
    model = booleanMapping.execute(model);
    expect(model!.user!.b).toEqual(false);
  });
});

describe('doov mappings', () => {
  it('map to execute', () => {
    const mappings = DOOV.mappings(
      DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1),
      DOOV.map(name).to(link2)
    );
    model = mappings.execute(model);
    expect(link1.get(model)).toEqual('link of 1');
    expect(link2.get(model)).toEqual('test');
  });
});

describe('doov conditional mappings', () => {
  it('map to execute', () => {
    const mappings = DOOV.when(name.matches('^t.+')).then(
      DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1),
      DOOV.map(name).to(link2)
    );
    model = mappings.execute(model);
    expect(link1.get(model)).toEqual('link of 1');
    expect(link2.get(model)).toEqual('test');
    model = link1.set!(model, null);
    model = link2.set!(model, null);
    model = name.set!(model, 'other');
    model = mappings.execute(model);
    expect(link1.get(model)).toBeNull();
    expect(link2.get(model)).toBeNull();
  });
});
