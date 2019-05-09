export class Model {
  public user?: User;
}

export class User {
  public id: number;
  public name?: string;
  public links?: string[];

  public constructor(id: number) {
    this.id = id;
  }
}

export interface MyMap {
  [key: string]: string | null;
}
