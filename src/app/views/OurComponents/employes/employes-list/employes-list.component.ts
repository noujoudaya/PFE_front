import {Component, OnInit} from '@angular/core';
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {NgForOf} from "@angular/common";
import {Genre} from "../../../../services/enums/genre.enum";
import {FormsModule} from "@angular/forms";
import {SituationFamiliale} from "../../../../services/enums/situationFamiliale.enum";
import {StatutEmploye} from "../../../../services/enums/statutEmploye.enum";
import {Designation} from "../../../../services/enums/designation.enum";
import {TypeSalaire} from "../../../../services/enums/typeSalaire.enum";
import {TypeContrat} from "../../../../services/enums/typeContrat.enum";
import {Departement} from "../../../../services/models/departement.model";
import {DepartementService} from "../../../../services/services/departement.service";
import {Service} from "../../../../services/models/service.model";
import {ServiceService} from "../../../../services/services/service.service";
import {Fonction} from "../../../../services/models/fonction.model";
import {FonctionService} from "../../../../services/services/fonction.service";

@Component({
  selector: 'app-employes-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './employes-list.component.html',
  styleUrl: './employes-list.component.scss'
})
export class EmployesListComponent implements OnInit {

  //les enums
  genres = Object.values(Genre);
  situations = Object.values(SituationFamiliale);
  statuts = Object.values(StatutEmploye)
  designations = Object.values(Designation)
  typesSalaire = Object.values(TypeSalaire);
  typesContrats = Object.values(TypeContrat);

  departements: Departement[] = [];
  services: Service[] = [];
  fonctions: Fonction[] = [];

  ngOnInit(): void {
    this.findAll();
    this.loadDepartements();
    this.loadServices();
    this.loadFonctions();
  }

  constructor(private service: EmployeService,
              private departementService: DepartementService,
              private serviceService: ServiceService,
              private fonctionService: FonctionService) {
  }

  private loadDepartements(): void {
    this.departementService.findAll().subscribe({
      next: (departements) => {
        this.departements = departements;
        console.log('Départements chargés:', this.departements);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des départements:', error);
      }
    });
  }

  private loadServices(): void {
    this.serviceService.findAll().subscribe({
      next: (services) => {
        this.services = services;
        console.log('Services chargés:', this.services);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
      }
    });
  }

  private loadFonctions(): void {
    this.fonctionService.findAll().subscribe({
      next: (fonctions) => {
        this.fonctions = fonctions;
        console.log('Fonctions chargés:', this.fonctions);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fonctions:', error);
      }
    });
  }


  public findAll(): void {
    this.service.findAll().subscribe(data => {
        console.log(data);
        this.employes = data;
      }
    );
  }

  public save(): void {
    this.service.save().subscribe(data => {
      if (data > 0) {
        this.employes.push({...this.employe});
        this.employe = new Employe();
        alert("Employé enregisté avec succès");
      } else {
        alert("Erreur");
      }
    })
  }

  public deleteByCin(employe: Employe, index: number): void {
    if (employe.cin != null) {
      this.service.deleteByCin(employe.cin).subscribe(data => {
          if (data > 0) {
            this.employes.splice(index, 1);
          } else {
            alert("Erreur suppression");
          }
        }
      );
    }
  }

  get employe(): Employe {
    return this.service.employe;
  }

  set employe(value: Employe) {
    this.service.employe = value;
  }

  get employes(): Employe[] {
    return this.service.employes;
  }

  set employes(value: Employe[]) {
    this.service.employes = value;
  }
}
