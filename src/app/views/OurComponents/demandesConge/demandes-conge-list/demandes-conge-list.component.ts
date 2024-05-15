import {Component, OnInit} from '@angular/core';
import {DemandeCongeService} from "../../../../services/services/demande-conge.service";
import {DemandeConge} from "../../../../services/models/demande-conge.model";
import {NgClass, NgForOf} from "@angular/common";
import {StatutConge} from "../../../../services/enums/statutConge.enum";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {EnumToStringPipe} from "../../../../services/enums/enum-to-string.pipe";

@Component({
  selector: 'app-demandes-conge-list',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    FormsModule,
    EnumToStringPipe
  ],
  templateUrl: './demandes-conge-list.component.html',
  styleUrl: './demandes-conge-list.component.scss'
})
export class DemandesCongeListComponent implements OnInit{

  constructor(private demandeService: DemandeCongeService) {
  }

  private selectedDemande : DemandeConge | null = null;

  private searchTerms = new Subject<string>();


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

  public findAll():void{
    this.demandeService.findAll().subscribe(data=>{
      this.demandes=data;
    })
  }

  public accepter(demande:DemandeConge):void{
    if (demande.statutConge.toString() == 'Refusée') {
      alert("Cette demande de congé est déjà refusée. Elle ne peut pas être acceptée.");
      return;
    }
    this.selectedDemande = demande;
    this.demandeService.accepter(this.selectedDemande).subscribe(data=>{
      console.log(data);
      alert("Demande acceptée")
      this.findAll();
      this.selectedDemande = new DemandeConge();
      }
    )
  }

  public refuser(demande:DemandeConge):void{
    if (demande.statutConge.toString() == 'Acceptée') {
      alert("Cette demande de congé est déjà acceptée. Elle ne peut pas être refusée.");
      return;
    }
    this.selectedDemande = demande;
    this.demandeService.refuser(this.selectedDemande).subscribe(data=>{
        console.log(data);
        alert("Demande refusée")
      this.findAll();
        this.selectedDemande = new DemandeConge();
      }
    )
  }

  public supprimer(demande:DemandeConge,index:number):void{
    if (demande.statutConge.toString() == 'Acceptée') {
      alert("Cette demande de congé est déjà acceptée. Vous ne pouvez pas la supprimer.");
      return; // Quitter la fonction car l'utilisateur ne peut pas supprimer une demande acceptée
    }
    // Afficher une boîte de dialogue de confirmation
    const confirmation = confirm("Voulez-vous vraiment supprimer cette demande de congé ?");

    // Vérifier la réponse de l'utilisateur
    if (confirmation) {
      // Si l'utilisateur clique sur "OK", effectuer la suppression
      this.demandeService.deleteConge(demande.dateDemande, demande.employe.id, demande.typeConge.libelle).subscribe(data => {
        if (data > 0) {
          this.demandes.splice(index, 1);
        } else {
          alert("Erreur suppression");
        }
      });
    } else {
      // Si l'utilisateur clique sur "Annuler", ne rien faire
      console.log("Suppression annulée.");
    }
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

  protected readonly StatutConge = StatutConge;
}
