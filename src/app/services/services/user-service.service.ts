import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChangePasswordRequest} from "../models/change-password-request.model";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private url: string = 'http://localhost:8088/api/v1/users';

  constructor(private http: HttpClient) {
  }

  public countUsers():Observable<number>{
    return this.http.get<number>(this.url+'/count');
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http.patch(`${this.url}/change-password`, request);
  }
}
