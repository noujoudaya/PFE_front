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
    this.selectedDemande = demande;
    this.demandeService.accepter(this.selectedDemande).subscribe(data=>{
      console.log(data);
      alert("Demande acceptée")
      this.selectedDemande = new DemandeConge();
      }
    )
  }

  public refuser(demande:DemandeConge):void{
    this.selectedDemande = demande;
    this.demandeService.refuser(this.selectedDemande).subscribe(data=>{
        console.log(data);
        alert("Demande refusée")
        this.selectedDemande = new DemandeConge();
      }
    )
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
