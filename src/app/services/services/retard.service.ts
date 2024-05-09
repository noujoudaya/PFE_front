import {Injectable} from '@angular/core';
import {Retard} from "../models/retard.model";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RetardService {

  private _retard: Retard = new Retard();
  private _retards: Retard[] = [];
  private url = 'http://localhost:8088/api/v1/retards/';

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Array<Retard>> {
    return this.http.get<Array<Retard>>(this.url);
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
}
