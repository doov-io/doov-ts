import { Model, User } from '../../model';
import { StringFunction } from 'dsl/lang/StringFunction';
import * as DOOV from 'doov';
import { Function } from 'dsl/lang/Function';
import { NumberFunction } from 'dsl/lang/NumberFunction';
import { fieldsOf } from 'dsl/meta/MetadataUtils';
import { path } from 'Paths';
import { nullOrUndefined } from 'Utils';

let model: Model;
let user: User;

const id = DOOV.number(DOOV.field<Model, number>('user', 'id'));
const name = DOOV.string(DOOV.field<Model, string>('user', 'name'));
const link1 = DOOV.string(DOOV.field<Model, string>('user', 'links', 0));
const link2 = DOOV.string(DOOV.field<Model, string>('user', 'links', 1));

beforeEach(() => {
  model = new Model();
  user = new User(1);
  user.name = 'test';
  user.b = true;
  model.user = user;
});

describe('mappings', () => {
  const mappings = DOOV.mappings(
    DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1),
    DOOV.map(name).to(link2)
  );

  it('execute mapping', () => {
    model = mappings.execute(model);
    expect(link1.get(model)).toEqual('link of 1');
    expect(link2.get(model)).toEqual('test');
  });

  it('metadata fields', () => {
    console.log(mappings.metadata.readable);
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('conditional mapping then', () => {
  const mappings = DOOV.when(name.matches('^t.+')).then(
    DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1),
    DOOV.map(name).to(link2)
  );

  it('execute mapping', () => {
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

  it('metadata fields', () => {
    console.log(mappings.metadata.readable);
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('conditional mapping otherwise', () => {
  const mappings = DOOV.when(name.matches('!^t.+'))
    .then(DOOV.map(id.mapTo(StringFunction, v => 'link of ' + v)).to(link1), DOOV.map(name).to(link2))
    .otherwise(DOOV.map(link2).to(name), DOOV.map(link1.mapTo(NumberFunction, v => (v ? parseInt(v) : 0))).to(id));

  it('execute mapping', () => {
    model = link1.set!(model, '4');
    model = link2.set!(model, 'other');
    model = mappings.execute(model);
    expect(name.get(model)).toEqual('other');
    expect(id.get(model)).toEqual(4);
  });

  it('metadata fields', () => {
    console.log(mappings.metadata.readable);
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});

describe('type converter mapping', () => {
  const typeConverter = DOOV.converter((obj, _: Function<any>, input2: Function<number>) => {
    const value = input2.get(obj);
    return (!nullOrUndefined(value) ? value : 0) + 1;
  }, '+ 1 converter');

  const mappings = DOOV.mappings(
    DOOV.map(name, id)
      .using((obj, input, input2) => input.get(obj) + ':' + input2.get(obj))
      .to(link2),
    DOOV.map(id.mapTo(StringFunction, v => '' + v)).to(link1),
    DOOV.map(name, id)
      .using(typeConverter)
      .to(id)
  );

  it('execute mapping', () => {
    model = mappings.execute(model);
    expect(name.get(model)).toEqual('test');
    expect(id.get(model)).toEqual(2);
    expect(link2.get(model)).toEqual('test:1');
    expect(link1.get(model)).toEqual('1');
  });

  it('metadata fields', () => {
    for (let child of mappings.metadata.children()) {
      console.log(child.readable);
    }
    const fields = fieldsOf(mappings.metadata);
    expect(fields).toContainEqual(path(id.metadata.readable));
    expect(fields).toContainEqual(path(link1.metadata.readable));
    expect(fields).toContainEqual(path(link2.metadata.readable));
    expect(fields).toContainEqual(path(name.metadata.readable));
  });
});
