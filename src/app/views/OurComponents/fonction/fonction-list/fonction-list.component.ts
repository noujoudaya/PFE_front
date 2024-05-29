import {Component, OnInit} from '@angular/core';
import {Service} from "../../../../services/models/service.model";
import {FonctionService} from "../../../../services/services/fonction.service";
import {Fonction} from "../../../../services/models/fonction.model";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Departement} from "../../../../services/models/departement.model";
import {ServiceService} from "../../../../services/services/service.service";
import Swal from "sweetalert2";
import {Page} from "../../../../services/models/page.model";
import {Employe} from "../../../../services/models/employe.model";

@Component({
  selector: 'app-fonction-list',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf
    ],
  templateUrl: './fonction-list.component.html',
  styleUrl: './fonction-list.component.scss'
})
export class FonctionListComponent implements OnInit {

  updatedLibelle!: string;
  services: Service[] = [];

  fonctionsPage: Page<Fonction> = new Page<Fonction>();

  constructor(private fonctionService: FonctionService,
              private serviceService: ServiceService) {
  }

  ngOnInit(): void {
    this.getFonctionPage(0,5);
   // this.findAll();
    this.loadServices();
  }

  getPageNumbers(): number[] {
    const totalPages = this.fonctionsPage.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  getFonctionPage(page: number, size: number): void {
    this.fonctionService.getFonctions(page, size).subscribe({
      next: (page) => {
        this.fonctionsPage = page;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des fonctions paginés:', error);
      }
    });
  }

  public findAll(): void {
    this.fonctionService.findAll().subscribe(data => this.fonctions = data);
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

  public deleteByCode(fonction: Fonction, index: number): void {
    this.fonctionService.deleteByCode(fonction.code).subscribe(data => {
      if (data > 0) {
        this.fonctions.splice(index, 1);
      } else {
        Swal.fire({
          title: 'Oops ! Une erreur est survenue',
          icon: 'error',
        });
      }
    });
  }

  public update(fonction: Fonction): void {
    this.fonction.libelle = this.updatedLibelle;
    this.fonction.code = fonction.code;

    this.fonctionService.update().subscribe(data => {
      if (data > 0) {
        const index = this.fonctions.findIndex(s => s.id === fonction.id);
        if (index !== -1) {
          this.fonctions[index].libelle = this.fonction.libelle;
          // Update any other properties as needed
          Swal.fire({
            title: 'Fonction modifié !',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.updatedLibelle = '';
        } else {
          Swal.fire({
            title: 'Service non trouvé !',
            icon: 'error',
          });
        }
      } else {
        Swal.fire({
          title: 'Oops ! Une erreur est survenue',
          icon: 'error',
        });
      }
      this.fonctionService.fonction = new Fonction();
    });
  }

  public save(): void {

    this.fonction.code = this.fonction.libelle;
    this.fonctionService.save().subscribe(data => {
      if (data > 0) {
        this.fonctions.push({...this.fonction});
        Swal.fire({
          title: 'Fonction enregistré !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else if (data === 0){
        Swal.fire({
          title: 'Fonction existe déja !',
          icon: 'error',
        });
      }
      else {
        Swal.fire({
          title: 'Veuillez sélectionner un service !',
          icon: 'error',
        });
      }
      this.fonctionService.fonction = new Fonction();
    });
  }

  public confirmDelete(fonction: Fonction, index: number): void {
    Swal.fire({
      title: 'Voulez-vous vraiment supprimer cette fonction ?',
      showDenyButton: true,
      denyButtonText: 'Annuler',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
      this.deleteByCode(fonction, index);
        Swal.fire({
          title: 'Fonction supprimée !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else if (result.isDenied) {
        console.log('Supression annulée');
      }
    });

  }


  get fonction(): Fonction {
    return this.fonctionService.fonction;
  }

  set fonction(value: Fonction) {
    this.fonctionService.fonction = value;
  }

  get fonctions(): Array<Fonction> {
    return this.fonctionService.fonctions;
  }

  set fonctions(value: Array<Fonction>) {
    this.fonctionService.fonctions = value;
  }
}
