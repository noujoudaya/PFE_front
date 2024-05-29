import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Service} from "../models/service.model";
import {Observable} from "rxjs";
import {Departement} from "../models/departement.model";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private _service :Service = new Service();
  private _services :Service[] = [];
  private url: string="http://localhost:8088/api/v1/";


  constructor(private http : HttpClient, private router: Router) { }
  public save() : Observable<number>{
    return this.http.post<number>(this.url+'admin/service/',this.service);


  }
  public update() : Observable<number>{
    return this.http.put<number>(this.url+'admin/service/',this.service);

  }
  public findAll() : Observable<Array<Service>>{
    return this.http.get<Array<Service>>(this.url+'all/service/');
  }
  public findByCode(code: string) : Observable<Service>{
    return this.http.get<Service>(this.url+'code/'+code);
  }
  public findByDepartementCode(code: string) : Observable<Array<Service>>{
    return this.http.get<Array<Service>>(this.url+'service/departement/code/'+code);
  }
  public findByLibelle(libelle: string) : Observable<Service>{
    return this.http.get<Service>(this.url+'libelle/'+libelle);
  }
  public deleteByCode(code: string) : Observable<number>{
    return this.http.delete<number>(this.url+'admin/service/code/'+code);
  }
  public deleteByDepartementCode(code: string) : Observable<number>{
    return this.http.delete<number>(this.url+'/departement/code/'+code);
  }


  get service(): Service {
    if (this._service.departement == null) {
      this._service.departement = new Departement();
    }
    return this._service;
}
  set service(value: Service) {
    this._service = value;
  }
  get services(): Array<Service> {
    for (let service of this._services) {
      if (service.departement == null) {
        service.departement = new Departement();
      }
    }
    return this._services;
  }
  set services(value: Service[]) {
    this._services = value;
  }
}
