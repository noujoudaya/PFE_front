import {Component, OnInit} from '@angular/core';
import {DemandeAttestationService} from "../../../../services/services/demande-attestation.service";
import {DemandeAttestation} from "../../../../services/models/demande-attestation.model";
import {NgForOf} from "@angular/common";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-demandes-attestation-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './demandes-attestation-list.component.html',
  styleUrl: './demandes-attestation-list.component.scss'
})
export class DemandesAttestationListComponent implements OnInit {

  selectedDemandeAttest: DemandeAttestation = new DemandeAttestation();

  private searchTerms = new Subject<string>();

  ngOnInit(): void {
    this.findAll();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.demandeAttestService.searchDemandes(term))
    ).subscribe(demands => {
      this.demandesAttestation = demands;
    });
  }

  constructor(private demandeAttestService: DemandeAttestationService) {
  }

  public findAll(): void {
    this.demandeAttestService.findAll().subscribe(data => {
      this.demandesAttestation = data;
    })
  }

  public preparer(demande: DemandeAttestation): void {
    this.selectedDemandeAttest = demande;
    this.demandeAttestService.preparerDemande(this.selectedDemandeAttest).subscribe(data => {
      console.log(data);
      Swal.fire({
        title: 'Demande en cours de préparation !',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.findAll();
    })
  }

  public valider(demande: DemandeAttestation): void {
    this.selectedDemandeAttest = demande;
    this.demandeAttestService.validerDemande(this.selectedDemandeAttest).subscribe(data => {
      console.log(data);
      Swal.fire({
        title: 'Demande prête !',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.findAll();
      this.selectedDemandeAttest = new DemandeAttestation();
    })
  }

  public delete(demande: DemandeAttestation, index: number): void {
    if (demande.statutAttestation.toString() == 'En_Cours') {
      Swal.fire({
        title: 'Cette demande est en cours de traitement , vous ne pouvez pas la supprimer !',
        icon: 'error',
      });
      return; // Quitter la fonction car l'utilisateur ne peut pas supprimer une demande en cours
    } else if (demande.statutAttestation.toString() == 'Prête') {
      Swal.fire({
        title: 'Cette demande est déjà traitée ! Vous ne pouvez pas la supprimer',
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
        this.demandeAttestService.deleteAttest(demande.employe.id, demande.dateDemande).subscribe(data => {
          if (data > 0) {
            this.demandesAttestation.splice(index, 1);
            Swal.fire({
              title: 'Demande supprimée !',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Oops ! Une erreur est survenue',
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


  search(term: string): void {
    this.searchTerms.next(term);
  }

  get demandeAttestation(): DemandeAttestation {
    return this.demandeAttestService.demandeAttestation;
  }

  set demandeAttestation(value: DemandeAttestation) {
    this.demandeAttestService.demandeAttestation = value;
  }

  get demandesAttestation(): DemandeAttestation[] {
    return this.demandeAttestService.demandesAttestation;
  }

  set demandesAttestation(value: DemandeAttestation[]) {
    this.demandeAttestService.demandesAttestation = value;
  }

}
