import {Component, OnInit} from '@angular/core';
import {Employe} from "../../../../services/models/employe.model";
import {Fonction} from "../../../../services/models/fonction.model";
import {catchError, forkJoin, of} from "rxjs";
import {FonctionService} from "../../../../services/services/fonction.service";
import {ServiceService} from "../../../../services/services/service.service";
import {Service} from "../../../../services/models/service.model";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-fonction-secretaire',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './fonction-secretaire.component.html',
  styleUrl: './fonction-secretaire.component.scss'
})
export class FonctionSecretaireComponent implements OnInit{

  // @ts-ignore
  authenticatedEmploye: Employe;
  services:Service[]=[];
  fonctions:Fonction[]=[];

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      // @ts-ignore
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.loadServices();
  }

  constructor(private fonctionService:FonctionService,
              private serviceService:ServiceService) {
  }

  public loadServices():void{
    this.serviceService.findByDepartementCode(this.authenticatedEmploye.departement.code).subscribe(data=>{
      this.services=data;
      this.loadFonctions(this.services);
    })
  }

  private loadFonctions(services:Service[]): void {
    const requests = services.map(service =>
      this.fonctionService.findByServiceCode(service.code).pipe(
        catchError(error => {
          console.error(`Error fetching fonctions for service code ${service.code}:`, error);
          return of([]); // Return an empty array in case of error
        })
      )
    );

    forkJoin(requests).subscribe(
      (results) => {
        this.fonctions = results.flat(); // Flatten the array of arrays into a single array
      },
      (error) => {
        console.error('Error fetching fonctions:', error);
      }
    );
  }

}
