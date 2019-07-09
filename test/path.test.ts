import { getPath, getPathPromise, setPath, setPathPromiseValue, setProp } from '../src/path';
import { Model, MyMap, User } from './model';

describe('path', () => {
  let model: Model;
  let user: User;

  beforeEach(() => {
    model = new Model();
    user = new User(1);
    user.name = 'test';
    model.user = user;
  });

  it('get from path', () => {
    let path = getPath(model, 'user', 'name');
    expect(path).toEqual('test');
    expect(getPath(model, 'user', 'id')).toEqual(1);
  });

  it('get from path string promise', () => {
    expect(getPathPromise(model, 'user', 'name')).resolves.toEqual('test');
  });

  it('get from path number promise', () => {
    expect(getPathPromise(model, 'user', 'id')).resolves.toEqual(1);
  });

  it('get in map', () => {
    let map: MyMap = {
      t: 'test',
    };
    return expect(getPathPromise(map, 't')).resolves.toEqual('test');
  });

  it('set in object', () => {
    let user = new User(1);
    let usr = setProp('name', 'test', user);
    expect(usr.name).toEqual('test');
  });

  it('set in array', () => {
    let array: string[] = [];
    let ary = setProp(0, 'test', array);
    expect(ary[0]).toEqual('test');
  });

  it('set in map', () => {
    let map: MyMap = {
      t: 'test',
    };
    let mp = setProp('t', 'test2', map);
    expect(mp['t']).toEqual('test2');
  });
});

describe('path', () => {
  let model: Model;
  let user: User;

  beforeEach(() => {
    model = new Model();
    user = new User(1);
    user.name = 'test';
    model.user = user;
  });

  it('set from path string', () => {
    let mdl: Model = setPath(model, 'test2', 'user', 'name');
    expect(mdl.user!.name).toEqual('test2');
  });

  it('set from path number', () => {
    let mdl = setPath(model, 0, 'user', 'id');
    expect(mdl.user!.id).toEqual(0);
  });

  it('set from path array', () => {
    let mdl = setPath(model, 'array', 'user', 'links', 1);
    expect(mdl.user!.links![1]).toEqual('array');
    expect(mdl.user!.links![0]).toBeUndefined();
  });
});

describe('path promise', () => {
  let model: Model;
  let user: User;

  beforeEach(() => {
    model = new Model();
    user = new User(1);
    user.name = 'test';
    model.user = user;
  });

  it('set from path string', () => {
    let modelPromise = setPathPromiseValue(model, 'test2', 'user', 'name');
    return modelPromise.then(value => {
      expect(value.user!.name).toEqual('test2');
    });
  });

  it('set from path number', () => {
    let modelPromise = setPathPromiseValue(model, 0, 'user', 'id');
    return modelPromise.then(value => {
      expect(value.user!.id).toEqual(0);
    });
  });

  it('set from path array', () => {
    let modelPromise = setPathPromiseValue(model, 'array', 'user', 'links', 1);
    return modelPromise.then(value => {
      expect(value.user!.links![1]).toEqual('array');
      expect(value.user!.links![0]).toBeUndefined();
    });
  });
});
