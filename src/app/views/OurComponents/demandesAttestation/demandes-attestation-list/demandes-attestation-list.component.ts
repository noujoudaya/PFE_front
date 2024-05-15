import {Component, OnInit} from '@angular/core';
import {DemandeAttestationService} from "../../../../services/services/demande-attestation.service";
import {DemandeAttestation} from "../../../../services/models/demande-attestation.model";
import {NgForOf} from "@angular/common";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";

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
      alert("Demande en cours de préparation");
      this.findAll();
    })
  }

  public valider(demande: DemandeAttestation): void {
    this.selectedDemandeAttest = demande;
    this.demandeAttestService.validerDemande(this.selectedDemandeAttest).subscribe(data => {
      console.log(data);
      alert("Demande prête");
      this.findAll();
      this.selectedDemandeAttest = new DemandeAttestation();
    })
  }

  public delete(demande: DemandeAttestation, index: number):void{
    if (demande.statutAttestation.toString() == 'En_Cours') {
      alert("Cette demande est au cours de traitement. Vous ne pouvez pas la supprimer.");
      return; // Quitter la fonction car l'utilisateur ne peut pas supprimer une demande acceptée
    } else if (demande.statutAttestation.toString() == 'Prête') {
      alert("Cette demande est déja traitée. Vous ne pouvez pas la supprimer.");
      return;
    }
    const confirmation = confirm("Voulez-vous vraiment supprimer cette demande d'attestation ?");

    // Vérifier la réponse de l'utilisateur
    if (confirmation) {
      this.demandeAttestService.deleteAttest(demande.employe.id, demande.dateDemande).subscribe(data => {
        if (data > 0) {
          this.demandesAttestation.splice(index, 1);
        }
        else {
          alert("Erreur suppression");
        }
      });
    }
    else {
      // Si l'utilisateur clique sur "Annuler", ne rien faire
      console.log("Suppression annulée.");
    }
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
