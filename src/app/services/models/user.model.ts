import {Role} from "./role.model";

export class User {
  // @ts-ignore
  public id:number;
  // @ts-ignore
  public firstname:string;
  // @ts-ignore
  public lastname:string;
  // @ts-ignore
  public login:string;
  // @ts-ignore
  public accountLocked:boolean;
  // @ts-ignore
  public enabled:boolean;
  // @ts-ignore
  public createdDate:string;
  // @ts-ignore
  public lastModifiedDate:string;
  // @ts-ignore
  public roles: Array<Role>;
}
