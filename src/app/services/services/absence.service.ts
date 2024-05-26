import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Absence} from "../models/absence.model";
import {Observable} from "rxjs";
import {DemandeAttestation} from "../models/demande-attestation.model";
import {Employe} from "../models/employe.model";
import {Departement} from "../models/departement.model";

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private _absence: Absence = new Absence();
  private _absences: Absence[] = [];

  private _absenceSec: Absence = new Absence();
  private _absencesSec: Absence[] = [];

  private url = 'http://localhost:8088/api/v1/';

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Array<Absence>> {
    return this.http.get<Array<Absence>>(this.url + 'sup/absences/');
  }

  public save(absence: Absence): Observable<number> {
    return this.http.post<number>(this.url + 'secretaire/absences/save', absence);
  }

  public deleteByDateAbsenceAndEmploye(dateAbsence: string, employe: Employe): Observable<number> {
    return this.http.delete<number>(`${this.url}secretaire/absences/dateAbsence/${dateAbsence}/employe`, {body: employe});
  }

  public justifier(absence: Absence): Observable<string> {
    return this.http.post<string>(this.url + 'admin/absences/justifier', absence, {responseType: 'text' as 'json'})
  }

  public searchAbsences(term: string): Observable<Array<Absence>> {
    return this.http.get<Array<Absence>>(this.url + 'sup/absences/search', {params: {search: term}});
  }

  public findByEmployeDepartement(departement: Departement): Observable<Array<Absence>> {
    return this.http.post<Array<Absence>>(this.url + 'sup/absences/departement', departement);
  }

  get absence(): Absence {
    return this._absence;
  }

  set absence(value: Absence) {
    this._absence = value;
  }

  get absences(): Absence[] {
    return this._absences;
  }

  set absences(value: Absence[]) {
    this._absences = value;
  }


  get absenceSec(): Absence {
    return this._absenceSec;
  }

  set absenceSec(value: Absence) {
    this._absenceSec = value;
  }

  get absencesSec(): Absence[] {
    return this._absencesSec;
  }

  set absencesSec(value: Absence[]) {
    this._absencesSec = value;
  }
}
