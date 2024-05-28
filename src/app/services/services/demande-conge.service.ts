import {Injectable} from '@angular/core';
import {DemandeConge} from "../models/demande-conge.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employe} from "../models/employe.model";
import {StatutConge} from "../enums/statutConge.enum";
import value from "*.json";
import {Page} from "../models/page.model";
import {DemandeAttestation} from "../models/demande-attestation.model";

@Injectable({
  providedIn: 'root'
})
export class DemandeCongeService {

  private _demande: DemandeConge = new DemandeConge();
  private _demandes: DemandeConge[] = [];
  private _demandeEmploye: DemandeConge = new DemandeConge();
  private _demandesEmploye: DemandeConge[] = [];
  private url = 'http://localhost:8088/api/v1/';

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Array<DemandeConge>> {
    return this.http.get<Array<DemandeConge>>(this.url+'admin/demandesConge/');
  }

  public accepter(demande: DemandeConge): Observable<string> {
    return this.http.post<string>(this.url + 'admin/demandesConge/accepterDemande', demande, {responseType: 'text' as 'json'});
  }

  public refuser(demande: DemandeConge): Observable<string> {
    return this.http.post<string>(this.url + 'admin/demandesConge/refuserDemande', demande, {responseType: 'text' as 'json'});
  }

  public searchDemandes(term: string): Observable<Array<DemandeConge>> {
    return this.http.get<Array<DemandeConge>>(this.url + 'admin/demandesConge/search', {params: {search: term}});
  }

  public findByStatut(statut: StatutConge): Observable<Array<DemandeConge>> {
    return this.http.get<Array<DemandeConge>>(this.url + '/statutConge/' + statut);
  }

  public save(demandeConge: DemandeConge): Observable<number> {
    return this.http.post<number>(this.url + 'employe-secretaire/demandesConge/save', demandeConge);
  }

  public countByStatutConge():Observable<number>{
    return this.http.get<number>(this.url+'admin/demandesConge/countByStatutConge');
  }

  public findByEmploye(employe:Employe):Observable<Array<DemandeConge>>{
    return this.http.post<Array<DemandeConge>>(this.url+'employe-secretaire/demandesConge/employe',employe);
  }

  public deleteConge(dateDemande:string,employeId:number,typeConge:string):Observable<number>{
    return this.http.post<number>(`${this.url}all/demandesConge/deleteConge/${dateDemande}/${employeId}/${typeConge}`, null);  }

  public getDemandesConge(page: number, size: number): Observable<Page<DemandeConge>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<DemandeConge>>(this.url+'admin/demandesConge/paginated', { params });
  }

  public getDemandesCongeByEmploye(employe:Employe,page: number, size: number): Observable<Page<DemandeConge>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.post<Page<DemandeConge>>(this.url+'employe-secretaire/demandesConge/employe/paginated',employe, { params });
  }

  get demande(): DemandeConge {
    return this._demande;
  }

  set demande(value: DemandeConge) {
    this._demande = value;
  }

  get demandes(): DemandeConge[] {
    return this._demandes;
  }

  set demandes(value: DemandeConge[]) {
    this._demandes = value;
  }


  get demandeEmploye(): DemandeConge {
    return this._demandeEmploye;
  }

  set demandeEmploye(value: DemandeConge) {
    this._demandeEmploye = value;
  }

  get demandesEmploye(): DemandeConge[] {
    return this._demandesEmploye;
  }

  set demandesEmploye(value: DemandeConge[]) {
    this._demandesEmploye = value;
  }
}
