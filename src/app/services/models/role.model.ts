import {User} from "./user.model";

export class Role {
   // @ts-ignore
  id:number;
  // @ts-ignore
  name: string;
  // @ts-ignore
  createdDate: string;
  // @ts-ignore
  lastModifiedDate:string;
  // @ts-ignore
  users:User[];
}

