import { Injectable } from '@angular/core';
import {Employe} from "../models/employe.model";
import {BulletinPaie} from "../models/bulletin-paie.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Departement} from "../models/departement.model";
import {Rubrique} from "../models/rubrique.model";
import {Entreprise} from "../models/entreprise.model";
import {Service} from "../models/service.model";
import {Fonction} from "../models/fonction.model";

@Injectable({
  providedIn: 'root'
})
export class BulletinPaieService {
  private _bulltinPaie: BulletinPaie = new BulletinPaie();
  private _bulltinPaies: BulletinPaie[] = [];
  private url: string = "http://localhost:8088/api/v1/";
  _selectedRubriques: Rubrique[] = [];
  constructor(private http: HttpClient) { }


  public calculer(bulletinPaie :BulletinPaie): Observable<BulletinPaie> {

    return this.http.post<BulletinPaie>(this.url + 'bulletin/calculer/', bulletinPaie);
  }
  public generer(bulletinPaie :BulletinPaie): Observable<number> {
console.log(this.bulletinPaie)
    return this.http.post<number>(this.url + 'bulletin/save/', bulletinPaie);
  }
  public findPdf(code: number): Observable<Blob> {
    return this.http.get(this.url + 'bulletin/pdf/code/' + code, { responseType: 'blob' });
  }





  public findByEmployeMatricule(matricule: number): Observable<BulletinPaie> {
    return this.http.get<BulletinPaie>(this.url + 'bulletin/employe/matricule/' + matricule);
  }
  public findAll(): Observable<Array<BulletinPaie>> {
    return this.http.get <Array<BulletinPaie>>(this.url+'bulletin/');
  



  get bulletinPaie(): BulletinPaie {
    return this._bulltinPaie;
  }


  set bulletinPaie(value: BulletinPaie) {
    this._bulltinPaie = value;
  }


  get bulletinPaies(): BulletinPaie[] {
    return this._bulltinPaies;
  }


  set bulletinPaies(value: BulletinPaie[]) {
    this._bulltinPaies = value;
  }
  set selectedRubriques(value: Rubrique[]) {
    this._selectedRubriques= value;
  }
  get selectedRubriques(): Rubrique[]{
    return this._selectedRubriques;
  }
}
