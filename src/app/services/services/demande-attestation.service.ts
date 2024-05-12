import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DemandeAttestation} from "../models/demande-attestation.model";
import {Observable} from "rxjs";
import {DemandeConge} from "../models/demande-conge.model";
import value from "*.json";

@Injectable({
  providedIn: 'root'
})
export class DemandeAttestationService {
  private _demandeAttestation: DemandeAttestation = new DemandeAttestation();
  private _demandesAttestation: DemandeAttestation[] = [];

  private _demandeEmploye: DemandeAttestation = new DemandeAttestation();
  private _demandesEmploye: DemandeAttestation[] = [];

  private url = 'http://localhost:8088/api/v1/demandesAttestation/';

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Array<DemandeAttestation>> {
    return this.http.get<Array<DemandeAttestation>>(this.url);
  }

  public preparerDemande(demandeAttestation:DemandeAttestation): Observable<string>{
    return this.http.post<string>(this.url+'preparerDemande',demandeAttestation,{ responseType: 'text' as 'json' });
  }

  public validerDemande(demandeAttestation:DemandeAttestation): Observable<string>{
    return this.http.post<string>(this.url+'validerDemande',demandeAttestation,{ responseType: 'text' as 'json' });
  }

  public searchDemandes(term: string): Observable<Array<DemandeAttestation>> {
    return this.http.get<Array<DemandeAttestation>>(this.url + 'search', {params: {search: term}});
  }

  public save(demande:DemandeAttestation):Observable<number>{
    return this.http.post<number>(this.url+'save',demande);
  }
  get demandeAttestation(): DemandeAttestation {
    return this._demandeAttestation;
  }

  set demandeAttestation(value: DemandeAttestation) {
    this._demandeAttestation = value;
  }

  get demandesAttestation(): DemandeAttestation[] {
    return this._demandesAttestation;
  }

  set demandesAttestation(value: DemandeAttestation[]) {
    this._demandesAttestation = value;
  }


  get demandeEmploye(): DemandeAttestation {
    return this._demandeEmploye;
  }

  set demandeEmploye(value: DemandeAttestation) {
    this._demandeEmploye = value;
  }

  get demandesEmploye(): DemandeAttestation[] {
    return this._demandesEmploye;
  }

  set demandesEmploye(value: DemandeAttestation[]) {
    this._demandesEmploye = value;
  }
}
