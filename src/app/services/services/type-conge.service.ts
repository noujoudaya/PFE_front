import { Injectable } from '@angular/core';
import {TypeConge} from "../models/type-conge.model";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TypeCongeService {

  private _type : TypeConge = new TypeConge();
  private _types: TypeConge[] = [];
  private  url = 'http://localhost:8088/api/v1/';

  constructor(private http:HttpClient) { }

  public findAll():Observable<Array<TypeConge>>{
    return this.http.get<Array<TypeConge>>(this.url+'all/typeConge/');
  }


  get type(): TypeConge {
    return this._type;
  }

  set type(value: TypeConge) {
    this._type = value;
  }

  get types(): TypeConge[] {
    return this._types;
  }

  set types(value: TypeConge[]) {
    this._types = value;
  }
}
