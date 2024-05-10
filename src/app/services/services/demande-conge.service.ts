import {Injectable} from '@angular/core';
import {DemandeConge} from "../models/demande-conge.model";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employe} from "../models/employe.model";
import {StatutConge} from "../enums/statutConge.enum";

@Injectable({
  providedIn: 'root'
})
export class DemandeCongeService {

  private _demande: DemandeConge = new DemandeConge();
  private _demandes: DemandeConge[] = [];
  private url = 'http://localhost:8088/api/v1/demandesConge/';

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Array<DemandeConge>> {
    return this.http.get<Array<DemandeConge>>(this.url);
  }

  public accepter(demande: DemandeConge): Observable<string> {
    return this.http.post<string>(this.url + 'accepterDemande', demande, {responseType: 'text' as 'json'});
  }

  public refuser(demande: DemandeConge): Observable<string> {
    return this.http.post<string>(this.url + 'refuserDemande', demande, {responseType: 'text' as 'json'});
  }

  public searchDemandes(term: string): Observable<Array<DemandeConge>> {
    return this.http.get<Array<DemandeConge>>(this.url + 'search', {params: {search: term}});
  }

  public findByStatut(statut: StatutConge): Observable<Array<DemandeConge>> {
    return this.http.get<Array<DemandeConge>>(this.url + '/statutConge/' + statut);
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
}
