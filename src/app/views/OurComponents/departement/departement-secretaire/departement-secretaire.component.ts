import {Component, OnInit} from '@angular/core';
import {Employe} from "../../../../services/models/employe.model";
import {EmployeService} from "../../../../services/services/employe.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-departement-secretaire',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './departement-secretaire.component.html',
  styleUrl: './departement-secretaire.component.scss'
})
export class DepartementSecretaireComponent implements OnInit{

  // @ts-ignore
  authenticatedEmploye: Employe;

  employes:Employe[]=[];

  ngOnInit(): void {
    // @ts-ignore
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      // @ts-ignore
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.findByDepartement();
  }

  constructor(private employeService:EmployeService) {
  }

  public findByDepartement():void{
    this.employeService.findByDepartement(this.authenticatedEmploye.departement).subscribe(data=>{
      this.employes=data;
    })
  }

}
