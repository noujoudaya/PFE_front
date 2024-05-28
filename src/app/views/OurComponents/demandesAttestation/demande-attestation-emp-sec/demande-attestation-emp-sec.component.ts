import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {TypeAttestation} from "../../../../services/enums/typeAttestation.enum";
import {TypeContrat} from "../../../../services/enums/typeContrat.enum";
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {DemandeAttestationService} from "../../../../services/services/demande-attestation.service";
import {DemandeAttestation} from "../../../../services/models/demande-attestation.model";
import Swal from "sweetalert2";
import {Page} from "../../../../services/models/page.model";

@Component({
  selector: 'app-demande-attestation-emp-sec',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './demande-attestation-emp-sec.component.html',
  styleUrl: './demande-attestation-emp-sec.component.scss'
})
export class DemandeAttestationEmpSecComponent implements OnInit {

  demandesPage: Page<DemandeAttestation> = new Page<DemandeAttestation>();

  // @ts-ignore
  authenticatedEmploye: Employe;
  authenticatedEmpAttest: DemandeAttestation[] = [];

  ngOnInit(): void {
    this.loadEmployes();
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
   // this.findByEmploye();
    this.getDemandesAttestPage(this.authenticatedEmploye,0,5);
  }

  constructor(private employeService: EmployeService,
              private demandeService: DemandeAttestationService) {
  }

  // @ts-ignore
  typesAttest: string[] = Object.keys(TypeAttestation).filter(key => typeof TypeAttestation[key] === 'string');

  employes: Employe[] = [];

  getPageNumbers(): number[] {
    const totalPages = this.demandesPage.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  getDemandesAttestPage(employe:Employe,page: number, size: number): void {
    this.demandeService.getDemandesAttestByEmploye(this.authenticatedEmploye,page, size).subscribe({
      next: (page) => {
        this.demandesPage = page;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des demandes paginés:', error);
      }
    });
  }

  private loadEmployes(): void {
    this.employeService.findAll().subscribe({
      next: (employes) => {
        this.employes = employes;
        console.log('Employés chargés:', this.employes);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    });
  }

  public save(demande: DemandeAttestation): void {
    demande.employe=this.authenticatedEmploye;
    this.demandeService.save(demande).subscribe(data => {
      if (data > 0) {
        Swal.fire({
          title: 'Demande enregistrée !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.findByEmploye();
        this.demandeEmploye = new DemandeAttestation();
      } else {
        Swal.fire({
          title: 'Oops! Une erreur est survenue',
          icon: 'error',
        });
      }
    });
  }

  public findByEmploye(): void {
    this.demandeService.findByEmploye(this.authenticatedEmploye).subscribe(data => {
      this.authenticatedEmpAttest = data;
      console.log('Demandes attesta de l\'employé:', this.authenticatedEmpAttest);
    })
  }

  public deleteAttest(demande: DemandeAttestation, index: number): void {
    if (demande.statutAttestation.toString() == 'En_Cours') {
      Swal.fire({
        title: 'Cette demande est au cours de traitement. Vous ne pouvez pas la supprimer.',
        icon: 'error',
      });
      return; // Quitter la fonction car l'utilisateur ne peut pas supprimer une demande acceptée
    } else if (demande.statutAttestation.toString() == 'Prête') {
      Swal.fire({
        title: 'Cette demande est déja traitée. Vous ne pouvez pas la supprimer.',
        icon: 'error',
      });
      return;
    }
    Swal.fire({
      title: 'Voulez-vous vraiment supprimer cette demande ?',
      showDenyButton: true,
      denyButtonText: 'Annuler',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.demandeService.deleteAttest(demande.employe.id, demande.dateDemande).subscribe(data => {
          if (data > 0) {
            this.authenticatedEmpAttest.splice(index, 1);
            Swal.fire({
              title: 'Demande supprimée !',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Oops! Une erreur est survenue',
              icon: 'error',
            });
          }
        });
      } else {
        // Si l'utilisateur clique sur "Annuler", ne rien faire
        console.log("Suppression annulée.");
      }
    });
  }

  get demandeEmploye(): DemandeAttestation {
    return this.demandeService.demandeAttestation;
  }

  set demandeEmploye(value: DemandeAttestation) {
    this.demandeService.demandeAttestation = value;
  }

  get demandesEmploye(): DemandeAttestation[] {
    return this.demandeService.demandesAttestation;
  }

  set demandesEmploye(value: DemandeAttestation[]) {
    this.demandeService.demandesAttestation = value;
  }

}
