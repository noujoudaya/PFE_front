import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employe} from "../models/employe.model";
import {Entreprise} from "../models/entreprise.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private _entreprise: Entreprise = new Entreprise;
  private _entreprises: Entreprise[] = [];


  private url: string = "http://localhost:8088/api/v1/entreprise/";
  public searchEntreprise(ice: string): Observable<Entreprise> {
    return this.http.get<Entreprise>(this.url +'ice/'+ice);
  }
  constructor(private http: HttpClient) { }




  get entreprise(): Entreprise {
    return this._entreprise;
  }

  set entreprise(value: Entreprise) {
    this._entreprise = value;
  }
  get entreprises(): Entreprise[] {
    return this._entreprises;
  }

  set entreprises(value: Entreprise[]) {
    this._entreprises = value;
  }


}
