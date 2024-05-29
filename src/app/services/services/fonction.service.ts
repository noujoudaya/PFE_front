import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Fonction} from "../models/fonction.model";
import {Observable} from "rxjs";
import {Service} from "../models/service.model";
import {Router} from "@angular/router";
import {Page} from "../models/page.model";
import {Departement} from "../models/departement.model";




@Injectable({
  providedIn: 'root'
})
export class FonctionService {
  private _fonction :Fonction = new Fonction();
  private _fonctions :Fonction[] = [];
  private url: string="http://localhost:8088/api/v1/";


  constructor(private http : HttpClient, private router: Router) { }
  public save() : Observable<number>{
    return this.http.post<number>(this.url+'admin/fonction/',this.fonction);

  }
  public update() : Observable<number>{
    return this.http.put<number>(this.url+'admin/fonction/',this.fonction);

  }
  public findAll() : Observable<Array<Fonction>>{
    return this.http.get<Array<Fonction>>(this.url+'all/fonction/');
  }

  public findByCode(code: string) : Observable<Fonction>{
    return this.http.get<Fonction>(this.url+'code/'+code);
  }
  public findByServiceCode(code: string) : Observable<Array<Fonction>>{
    return this.http.get<Array<Fonction>>(this.url+'fonction/service/code/'+code);
  }
  public findByLibelle(libelle: string) : Observable<Fonction>{
    return this.http.get<Fonction>(this.url+'libelle/'+libelle);
  }
  public deleteByCode(code: string) : Observable<number>{
    return this.http.delete<number>(this.url+'admin/fonction/code/'+code);
  }
  public deleteByServiceCode(code: string) : Observable<number>{
    return this.http.delete<number>(this.url+'/service/code/'+code);

  }

  public getFonctions(page: number, size: number): Observable<Page<Fonction>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Fonction>>(this.url+'admin/fonction/paginated', { params });
  }


  get fonction(): Fonction {
    if (this._fonction.service == null) {
      this._fonction.service = new Service();
    }
    return this._fonction;
  }
  set fonction(value: Fonction) {
    this._fonction = value;
  }
  get fonctions(): Array<Fonction> {
    for (let fonction of this._fonctions) {
      if (fonction.service == null) {
        fonction.service = new Service();
      }
    }
    return this._fonctions;
  }
  set fonctions(value: Fonction[]) {
    this._fonctions = value;
  }
}
