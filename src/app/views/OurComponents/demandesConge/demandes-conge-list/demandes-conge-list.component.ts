import {Component, OnInit} from '@angular/core';
import {DemandeCongeService} from "../../../../services/services/demande-conge.service";
import {DemandeConge} from "../../../../services/models/demande-conge.model";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {StatutConge} from "../../../../services/enums/statutConge.enum";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {EnumToStringPipe} from "../../../../services/enums/enum-to-string.pipe";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";

declare var bootstrap: any;

@Component({
  selector: 'app-demandes-conge-list',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    FormsModule,
    EnumToStringPipe,
    NgIf,
  ],
  templateUrl: './demandes-conge-list.component.html',
  styleUrl: './demandes-conge-list.component.scss'
})
export class DemandesCongeListComponent implements OnInit {

  constructor(private demandeService: DemandeCongeService, private modalService: NgbModal) {
  }

  protected selectedDemande: DemandeConge = new DemandeConge();

  private searchTerms = new Subject<string>();

  public motifRefus: string = '';

  public StatutConge = StatutConge;

  ngOnInit(): void {
    this.findAll();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.demandeService.searchDemandes(term))
    ).subscribe(demands => {
      this.demandes = demands;
    });
  }

  public findAll(): void {
    this.demandeService.findAll().subscribe(data => {
      this.demandes = data;
    })
  }

  public accepter(demande: DemandeConge): void {
    if (demande.statutConge.toString() == 'Refusée') {
      Swal.fire({
        title: 'Cette demande est déja refusée !',
        icon: 'error',
        confirmButtonText: 'OK'

      });
      return;
    }
    this.selectedDemande = demande;
    this.demandeService.accepter(this.selectedDemande).subscribe(data => {
        console.log(data);
      Swal.fire({
        title: 'Demande acceptée !',
        icon: 'success',
        confirmButtonText: 'OK'

      });
        //alert("Demande acceptée")
        this.findAll();
        this.selectedDemande = new DemandeConge();
      }
    )
  }

  public openRefusModal(demande: DemandeConge): void {
    if (demande.statutConge.toString() === 'Acceptée') {
      Swal.fire({
        title: 'Cette demande est déja acceptée !',
        icon: 'error',
        confirmButtonText: 'OK'

      });
      return;
    }
    this.selectedDemande = demande;
    this.motifRefus = '';


    const modalElement = document.getElementById('refusModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  showDetailsDemande(demande: DemandeConge): void {
    this.selectedDemande = demande;
    console.log(this.selectedDemande.statutConge);
  }

  public enregistrerRefus(): void {
    if (this.selectedDemande) {
      this.selectedDemande.motifRefus = this.motifRefus;
      this.selectedDemande.statutConge = StatutConge.Refusée;
      this.demandeService.refuser(this.selectedDemande).subscribe(data => {
        console.log(data);
        Swal.fire({
          title: 'Demande refusée !',
          icon: 'success',
          confirmButtonText: 'OK'

        });
        this.findAll();
        this.selectedDemande = new DemandeConge();
      });
    }
    const modalElement = document.getElementById('refusModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

  public supprimer(demande: DemandeConge, index: number): void {
    if (demande.statutConge.toString() == 'Acceptée') {
      Swal.fire({
        title: 'Cette demande est déjà acceptée ! Vous ne pouvez pas la supprimer',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Quitter la fonction car l'utilisateur ne peut pas supprimer une demande acceptée
    }
    // Afficher une boîte de dialogue de confirmation
    Swal.fire({
      title: 'Voulez-vous vraiment supprimer cette demande ?',
      showDenyButton: true,
      denyButtonText: 'Annuler',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur clique sur "OK", effectuer la suppression
        this.demandeService.deleteConge(demande.dateDemande, demande.employe.id, demande.typeConge.libelle).subscribe(data => {
          if (data > 0) {
            Swal.fire({
              title: 'Demande supprimée !',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.demandes.splice(index, 1);
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

  get demande(): DemandeConge {
    return this.demandeService.demande;
  }

  set demande(value: DemandeConge) {
    this.demandeService.demande = value;
  }

  get demandes(): DemandeConge[] {
    return this.demandeService.demandes;
  }

  set demandes(value: DemandeConge[]) {
    this.demandeService.demandes = value;
  }

}
