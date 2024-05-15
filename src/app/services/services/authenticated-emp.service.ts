import {Injectable, OnInit} from '@angular/core';
import {Employe} from "../models/employe.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedEmpService implements OnInit{

  // @ts-ignore
   _authenticatedEmploye: Employe;

  constructor() { }

  ngOnInit(): void {

    // @ts-ignore
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      // @ts-ignore
      this._authenticatedEmploye = JSON.parse(storedEmployee);
    }

    }


  get authenticatedEmploye(): Employe {
    return this._authenticatedEmploye;
  }

  set authenticatedEmploye(value: Employe) {
    this._authenticatedEmploye = value;
  }
}
