import {Component, OnInit} from '@angular/core';
import {Employe} from "../../../../services/models/employe.model";
import {EmployeService} from "../../../../services/services/employe.service";
import {NgForOf} from "@angular/common";
import {Page} from "../../../../services/models/page.model";
import {DemandeConge} from "../../../../services/models/demande-conge.model";
import {Departement} from "../../../../services/models/departement.model";

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

  employesPage: Page<Employe> = new Page<Employe>();

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
    //this.findByDepartement();
    this.getEmployePage(this.authenticatedEmploye.departement,0,5);
  }

  constructor(private employeService:EmployeService) {
  }

  getPageNumbers(): number[] {
    const totalPages = this.employesPage.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  getEmployePage(departement:Departement,page: number, size: number): void {
    this.employeService.getEmployeByDepartement(this.authenticatedEmploye.departement,page, size).subscribe({
      next: (page) => {
        this.employesPage = page;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des demandes paginés:', error);
      }
    });
  }

  public findByDepartement():void{
    this.employeService.findByDepartement(this.authenticatedEmploye.departement).subscribe(data=>{
      this.employes=data;
    })
  }

}
