import { Injectable } from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {Rubrique} from "../models/rubrique.model";

import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RubriqueService {
  private _rubrique: Rubrique = new Rubrique();
  private _rubriques: Rubrique[] = [];
  private url: string = "http://localhost:8088/api/v1/rubrique/";
  constructor(private http: HttpClient) { }

  public findByCode(code: number): Observable<Rubrique> {
    return this.http.get<Rubrique>(this.url + 'code/' + code);
  }
  public findAll(): Observable<Array<Rubrique>> {
    return this.http.get <Array<Rubrique>>(this.url);
  }


  get rubrique(): Rubrique {

    return this._rubrique;
  }


  set rubrique(value: Rubrique) {
    this._rubrique = value;
  }


  get rubriques(): Rubrique[] {
    return this._rubriques;
  }


  set rubriques(value: Rubrique[]) {
    this.rubriques = value;
  }
}
