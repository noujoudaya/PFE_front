import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Service} from "../models/service.model";
import {Observable} from "rxjs";
import {Departement} from "../models/departement.model";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private _service: Service = new Service();
  private _services: Service[] = [];
  private url = "http://localhost:8088/api/v1/service/";
  constructor(private http:HttpClient) { }

  public findAll():Observable<Array<Service>>{
    return this.http.get<Array<Service>>(this.url);
  }

  public findByDepartement(departement:Departement):Observable<Array<Service>>{
    return this.http.post<Array<Service>>(this.url+'departement',departement);
  }
  get service(): Service {
    return this._service;
  }

  set service(value: Service) {
    this._service = value;
  }

  get services(): Service[] {
    return this._services;
  }

  set services(value: Service[]) {
    this._services = value;
  }
}
