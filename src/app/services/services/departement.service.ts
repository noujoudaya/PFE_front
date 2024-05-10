import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Departement} from "../models/departement.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  private _departement: Departement = new Departement();
  private _departements: Departement[] = [];
  private url = "http://localhost:8088/api/v1/departement/";

  constructor(private http:HttpClient) { }

  public findAll(): Observable<Array<Departement>>{
    return this.http.get<Array<Departement>>(this.url);
  }

  get departement(): Departement {
    return this._departement;
  }

  set departement(value: Departement) {
    this._departement = value;
  }

  get departements(): Departement[] {
    return this._departements;
  }

  set departements(value: Departement[]) {
    this._departements = value;
  }
}
