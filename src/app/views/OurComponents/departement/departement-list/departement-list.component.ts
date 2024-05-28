import {Component, OnInit} from '@angular/core';
import {DepartementService} from "../../../../services/services/departement.service";
import {Departement} from "../../../../services/models/departement.model";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {Page} from "../../../../services/models/page.model";
import {Employe} from "../../../../services/models/employe.model";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-departement-list',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './departement-list.component.html',
  styleUrl: './departement-list.component.scss'
})
export class DepartementListComponent  implements OnInit {

  updatedLibelle!: string;

  departementsPage: Page<Departement> = new Page<Departement>();

  constructor(private departementService: DepartementService) {
  }

  ngOnInit(): void {
   // this.findAll();
    this.getDepartementsPage(0,5);
  }

  getPageNumbers(): number[] {
    const totalPages = this.departementsPage.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  getDepartementsPage(page: number, size: number): void {
    this.departementService.getDepartements(page, size).subscribe({
      next: (page) => {
        this.departementsPage = page;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des départements paginés:', error);
      }
    });
  }

  public findAll(): void {
    this.departementService.findAll().subscribe(data => this.departements = data);
  }

  public deleteByCode(departement: Departement, index: number): void {
    this.departementService.deleteByCode(departement.code).subscribe(data => {
      if (data > 0) {
        this.departements.splice(index, 1);
      } else {
        Swal.fire({
          title: 'Oops ! Une erreur est survenue',
          icon: 'error',
        });
      }
    });
  }

  public update(departement: Departement): void {
    if (this.updatedLibelle == null) {
      Swal.fire({
        title: 'Ajouter un nom !',
        icon: 'error',
      });
    } else {
      this.departement.libelle = this.updatedLibelle;
      this.departement.code = departement.code;

      this.departementService.update().subscribe(data => {
        if (data > 0) {
          const index = this.departements.findIndex(d => d.id === departement.id);
          if (index !== -1) {
            this.departements[index].libelle = this.departement.libelle;
            Swal.fire({
              title: 'Département modifié !',
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
        }
        else if(data === 0){
          Swal.fire({
            title: 'Ce département existe déja ! Veuillez ajouter un nouveau département',
            icon: 'error',
          });
          this.updatedLibelle = '';
        }
        else {
          Swal.fire({
            title: 'Oops ! Une erreur est survenue',
            icon: 'error',
          });
        }
        this.departementService.departement = new Departement();
      });
    }
  }

  public save(): void {
    if (this.departement.libelle == null) {
      Swal.fire({
        title: 'Ajouter un nom !',
        icon: 'error',
      });
    } else {
      this.departement.code = this.departement.libelle;
      this.departementService.save().subscribe(data => {
        if (data > 0) {
          this.departements.push({...this.departement});
          Swal.fire({
            title: 'Département enregistré !',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Département existe déja !',
            icon: 'error',
          });
        }
        this.departementService.departement = new Departement();
      });
    }
  }

  public confirmDelete(departement: Departement, index: number): void {
    Swal.fire({
      title: 'La suppression de ce département supprimera tous les services associés. Confirmez-vous la suppression ?',
      showDenyButton: true,
      denyButtonText: 'Annuler',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteByCode(departement, index);
        Swal.fire({
          title: 'Département supprimé !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else if (result.isDenied) {
        console.log('Supression annulée');
      }
    });

  }


  get departement(): Departement {
    return this.departementService.departement;
  }

  set departement(value: Departement) {
    this.departementService.departement = value;
  }

  get departements(): Array<Departement> {
    return this.departementService.departements;
  }

  set departements(value: Array<Departement>) {
    this.departementService.departements = value;
  }
}

