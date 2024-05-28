import {Injectable} from '@angular/core';
import {Retard} from "../models/retard.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Absence} from "../models/absence.model";
import value from "*.json";
import {Employe} from "../models/employe.model";
import {Departement} from "../models/departement.model";
import {Page} from "../models/page.model";

@Injectable({
  providedIn: 'root'
})
export class RetardService {

  private _retard: Retard = new Retard();
  private _retards: Retard[] = [];

  private _retardSec: Retard = new Retard();
  private _retardsSec: Retard[] = [];

  private url = 'http://localhost:8088/api/v1/';

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Array<Retard>> {
    return this.http.get<Array<Retard>>(this.url+'sup/retards/');
  }

  public save(retard: Retard): Observable<number> {
    return this.http.post<number>(this.url + 'secretaire/retards/save', retard);
  }

  public deleteByDateRetardAndEmploye(dateRetard: string, employe: Employe): Observable<number> {
    return this.http.delete<number>(`${this.url}secretaire/retards/dateRetard/${dateRetard}/employe`, {body: employe});
  }

  public searchRetards(term: string): Observable<Array<Retard>> {
    return this.http.get<Array<Retard>>(this.url + 'sup/retards/search', {params: {search: term}});
  }

  public justifier(retard: Retard): Observable<string> {
    return this.http.post<string>(this.url + 'admin/retards/justifier', retard,{ responseType: 'text' as 'json' });
  }

  public findByEmployeDepartement(departement:Departement):Observable<Array<Retard>>{
    return this.http.post<Array<Retard>>(this.url+'sup/retards/departement',departement);
  }

  public getRetards(departement:Departement,page: number, size: number): Observable<Page<Retard>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.post<Page<Retard>>(this.url+'sup/retards/paginated',departement, { params });
  }

  get retard(): Retard {
    return this._retard;
  }

  set retard(value: Retard) {
    this._retard = value;
  }

  get retards(): Retard[] {
    return this._retards;
  }

  set retards(value: Retard[]) {
    this._retards = value;
  }


  get retardSec(): Retard {
    return this._retardSec;
  }

  set retardSec(value: Retard) {
    this._retardSec = value;
  }

  get retardsSec(): Retard[] {
    return this._retardsSec;
  }

  set retardsSec(value: Retard[]) {
    this._retardsSec = value;
  }
}
