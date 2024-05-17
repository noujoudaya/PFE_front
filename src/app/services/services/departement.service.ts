import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Departement} from "../models/departement.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {Fonction} from "../models/fonction.model";


@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  private _departement :Departement = new Departement();
  private _departements :Departement[]=[];
  private url: string = "http://localhost:8088/api/v1/";

  constructor(private http: HttpClient, private router: Router) {
  }

  public save(): Observable<number> {
    return this.http.post<number>(this.url+'admin/departement/', this.departement);

  }

  public update(): Observable<number> {
    return this.http.put<number>(this.url+'admin/departement/', this.departement);

  }

  public findAll(): Observable<Array<Departement>> {
    return this.http.get<Array<Departement>>(this.url+'all/departement/');
  }

  public findByCode(code: string): Observable<Departement> {
    return this.http.get<Departement>(this.url + 'code/' + code);
  }

  public findByLibelle(libelle: string): Observable<Departement> {
    return this.http.get<Departement>(this.url + 'libelle/' + libelle);
  }

  public deleteByCode(code: string): Observable<number> {
    return this.http.delete<number>(this.url + 'admin/departement/code/' + code);
  }

  get departement(): Departement {
    return this._departement;
  }
  set departement(value: Departement) {
    this._departement = value;
  }
  get departements(): Array<Departement> {
    return this._departements;
  }

  set departements(value: Array<Departement>) {
    this._departements = value;
  }

}
