import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Absence} from "../models/absence.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private _absence: Absence = new Absence();
  private _absences: Absence[] = [];
  private url = 'http://localhost:8088/api/v1/absences/';

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Array<Absence>> {
    return this.http.get<Array<Absence>>(this.url);
  }

  public justifier(absence: Absence): Observable<string>{
    return this.http.post<string>(this.url+'justifier',absence,{ responseType: 'text' as 'json' })
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
}
