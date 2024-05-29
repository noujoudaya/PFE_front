import {Component, OnInit} from '@angular/core';
import {ServiceService} from "../../../../services/services/service.service";
import {Service} from "../../../../services/models/service.model";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {EmployesListComponent} from "../../employes/employes-list/employes-list.component";
import {Departement} from "../../../../services/models/departement.model";
import {DepartementService} from "../../../../services/services/departement.service";
import Swal from "sweetalert2";
import {Page} from "../../../../services/models/page.model";
import {Fonction} from "../../../../services/models/fonction.model";

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

  servicesPage: Page<Service> = new Page<Service>();

  constructor(private serviceService: ServiceService,
              private departementService: DepartementService) {
  }

  ngOnInit(): void {
   // this.findAll();
    this.getServicePage(0,5);
    this.loadDepartements();
  }


  getPageNumbers(): number[] {
    const totalPages = this.servicesPage.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  getServicePage(page: number, size: number): void {
    this.serviceService.getServices(page, size).subscribe({
      next: (page) => {
        this.servicesPage = page;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des services paginés:', error);
      }
    });
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
        Swal.fire({
          title: 'Oops ! Une erreur est survenue',
          icon: 'error',
        });
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
          Swal.fire({
            title: 'Service modifié !',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.updatedLibelle = '';
        } else {
          Swal.fire({
            title: 'Département non trouvé !',
            icon: 'error',
          });
        }
      } else {
        Swal.fire({
          title: 'Oops ! Une erreur est survenue',
          icon: 'error',
        });
      }
      this.serviceService.service = new Service();
    });
  }

public save(): void {

    this.service.code = this.service.libelle;
    this.serviceService.save().subscribe(data => {
      if (data > 0) {
        this.services.push({...this.service});
        Swal.fire({
          title: 'Service enregistré !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else if (data === 0){
        Swal.fire({
          title: 'Service existe déja !',
          icon: 'error',
        });
      }
      else {
        Swal.fire({
          title: 'Département n\'existe pas !',
          icon: 'error',
        });
      }
      this.serviceService.service = new Service();
    });
  }

public confirmDelete(service: Service, index: number): void {
  Swal.fire({
    title: 'La suppression de ce service supprimera toutes les fonctions associées. Confirmez-vous la suppression ?',
    showDenyButton: true,
    denyButtonText: 'Annuler',
    confirmButtonText: 'Oui, supprimer'
  }).then((result) => {
    if (result.isConfirmed) {
    this.deleteByCode(service, index);
      Swal.fire({
        title: 'Service supprimé !',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else if (result.isDenied) {
      console.log('Supression annulée');
    }
  });

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
