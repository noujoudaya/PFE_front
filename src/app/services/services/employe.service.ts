import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Employe} from "../models/employe.model";
import {Observable} from "rxjs";
import value from "*.json";
import {Departement} from "../models/departement.model";
import {Service} from "../models/service.model";
import {Genre} from "../enums/genre.enum";
import {Page} from "../models/page.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  private _employe: Employe = new Employe;
  private _employes: Employe[] = [];

  // @ts-ignore
  public _authenticatedEmploye: Employe;

  private url: string = "http://localhost:8088/api/v1/";

  constructor(private http: HttpClient) {
  }

  public save(): Observable<number> {
    return this.http.post<number>(this.url + 'admin/employes/save', this.employe);
  }

  public update(): Observable<number> {
    return this.http.post<number>(this.url + 'admin/employes/update', this.employe)
  }

  public findAll(): Observable<Array<Employe>> {
    return this.http.get <Array<Employe>>(this.url+'sup/employes/');
  }

  public searchEmployes(term: string): Observable<Array<Employe>> {
    return this.http.get<Array<Employe>>(this.url + 'admin/employes/search', {params: {search: term}});
  }

  public getEmployeeCount(): Observable<number> {
    return this.http.get<number>(this.url + 'admin/employes/count');
  }

  public deleteByCin(cin: string): Observable<number> {
    return this.http.delete<number>(this.url + 'admin/employes/cin/' + cin);
  }

  public findByDepartement(departement:Departement):Observable<Array<Employe>>{
    return this.http.post<Array<Employe>>(this.url+'sup/employes/departement/',departement);
  }

  public countEmployeByService(service:Service):Observable<number>{
    return this.http.post<number>(this.url+'count/service',service);
  }

  public countEmployeByDepartement(departement:Departement):Observable<number>{
    return this.http.post<number>(this.url+'count/departement/',departement);
  }
  public countEmployeByGenre(genre:Genre):Observable<number>{
    return this.http.get<number>(this.url+'count/genre/'+genre);
  }

  public getEmployes(page: number, size: number): Observable<Page<Employe>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Employe>>(this.url+'admin/employes/paginated', { params });
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


  get authenticatedEmploye(): Employe {
    return this._authenticatedEmploye;
  }

  set authenticatedEmploye(value: Employe) {
    this._authenticatedEmploye = value;
  }
}
