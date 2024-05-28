import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChangePasswordRequest} from "../models/change-password-request.model";
import {User} from "../models/user.model";
import {Page} from "../models/page.model";
import {Service} from "../models/service.model";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private _user:User=new User();
  private _users:User[]=[];

  private url: string = 'http://localhost:8088/api/v1/users';

  constructor(private http: HttpClient) {
  }

  public countUsers():Observable<number>{
    return this.http.get<number>(this.url+'/count');
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http.patch(`${this.url}/change-password`, request);
  }

  public findAllUsers():Observable<Array<User>>{
    return this.http.get<Array<User>>(this.url+'/all');
  }

  public findPureUsers():Observable<Array<User>>{
    return this.http.get<Array<User>>(this.url+'/pureUsers');
  }

  public countpureUsers():Observable<number>{
    return this.http.get<number>(this.url+'/countPureUsers')
  }

  public deleteByLogin(login:string):Observable<number>{
    return this.http.delete<number>(this.url+'/delete/login/'+login);
  }

  public lockAccount(user:User):Observable<number>{
    return this.http.post<number>(this.url+'/lockAccount',user);
  }

  public getPureUsers(page: number, size: number): Observable<Page<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<User>>(this.url+'/pure-users', { params });
  }

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get users(): User[] {
    return this._users;
  }

  set users(value: User[]) {
    this._users = value;
  }
}
