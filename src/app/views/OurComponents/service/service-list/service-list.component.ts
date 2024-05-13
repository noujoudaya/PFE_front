import {Component, OnInit} from '@angular/core';
import {ServiceService} from "../../../../services/services/service.service";
import {Service} from "../../../../services/models/service.model";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {EmployesListComponent} from "../../employes/employes-list/employes-list.component";
import {Departement} from "../../../../services/models/departement.model";
import {DepartementService} from "../../../../services/services/departement.service";

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent implements OnInit {

  updatedLibelle!: string;
  departements: Departement[] = [];

  constructor(private serviceService: ServiceService,
              private departementService: DepartementService) {
  }

  ngOnInit(): void {
    this.findAll();
    this.loadDepartements();
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
public findAll(): void {
    this.serviceService.findAll().subscribe(data => this.services = data);
  }

public deleteByCode(service: Service, index: number): void {
    this.serviceService.deleteByCode(service.code).subscribe(data => {
      if (data > 0) {
        this.services.splice(index, 1);
      } else {
        alert('error accured');
      }
    });
  }

public update(service: Service): void {
    this.service.libelle = this.updatedLibelle;
    this.service.code = service.code;

    this.serviceService.update().subscribe(data => {
      if (data > 0) {
        const index = this.services.findIndex(s => s.id === service.id);
        if (index !== -1) {
          this.services[index].libelle = this.service.libelle;
          // Update any other properties as needed
          alert('UPDATE SUCCESS');
          this.updatedLibelle = '';
        } else {
          alert('Department not found');
        }
      } else {
        alert('Error occurred');
      }
      this.serviceService.service = new Service();
    });
  }

public save(): void {

    this.service.code = this.service.libelle;
    this.serviceService.save().subscribe(data => {
      if (data > 0) {
        this.services.push({...this.service});
        alert('SAVE SUCCESS');
      } else if (data === 0){
        alert('Service existe déjà');
      }
      else {
        alert('departement nexiste pas');
      }
      this.serviceService.service = new Service();
    });
  }

public confirmDelete(service: Service, index: number): void {
    if (confirm('La suppression de ce département supprimera tous les services associés. Confirmez-vous la suppression ?')) {
    this.deleteByCode(service, index);
  }
}


  get service(): Service {
    return this.serviceService.service;
  }

  set service(value: Service) {
    this.serviceService.service = value;
  }

  get services(): Array<Service> {
    return this.serviceService.services;
  }

  set services(value: Array<Service>) {
    this.serviceService.services = value;
  }
}