import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Fonction} from "../models/fonction.model";
import {Observable} from "rxjs";
import {Service} from "../models/service.model";

@Injectable({
  providedIn: 'root'
})
export class FonctionService {

  private _fonction: Fonction = new Fonction();
  private _fonctions: Fonction[] = [];
  private url = "http://localhost:8088/api/v1/fonction/"

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Array<Fonction>> {
    return this.http.get<Array<Fonction>>(this.url);
  }

  public findByService(service: Service): Observable<Array<Fonction>> {
    return this.http.post<Array<Fonction>>(this.url+'service',service);
  }

  get fonction(): Fonction {
    return this._fonction;
  }

  set fonction(value: Fonction) {
    this._fonction = value;
  }

  get fonctions(): Fonction[] {
    return this._fonctions;
  }

  set fonctions(value: Fonction[]) {
    this._fonctions = value;
  }
}
