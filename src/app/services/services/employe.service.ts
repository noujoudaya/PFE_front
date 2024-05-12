import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employe} from "../models/employe.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  private _employe: Employe = new Employe;
  private _employes: Employe[] = [];
  private url: string = "http://localhost:8088/api/v1/employes/";

  constructor(private http:HttpClient) { }

  public save() : Observable<number>{
    return this.http.post<number>(this.url+'save',this.employe);
  }

  public update(): Observable<number>{
    return this.http.post<number>(this.url+'update',this.employe)
  }
  public findAll() :Observable<Array<Employe>>{
    return this.http.get <Array<Employe>>(this.url);
  }
  public searchEmployes(term: string): Observable<Array<Employe>> {
    return this.http.get<Array<Employe>>(this.url + 'search', { params: { search: term } });
  }

  public deleteByCin(cin:string): Observable<number>{
    return this.http.delete<number>(this.url+'cin/'+cin);
  }
  get employe(): Employe {
    return this._employe;
  }

  set employe(value: Employe) {
    this._employe = value;
  }

  get employes(): Employe[] {
    return this._employes;
  }

  set employes(value: Employe[]) {
    this._employes = value;
  }
}
