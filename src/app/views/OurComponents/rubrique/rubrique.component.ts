import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RubriqueService} from "../../../services/services/rubrique.service";
import {BulletinPaie} from "../../../services/models/bulletin-paie.model";
import {Rubrique} from "../../../services/models/rubrique.model";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BulletinPaieService} from "../../../services/services/bulletin-paie.service";

@Component({
  selector: 'app-rubrique',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,

  ],
  templateUrl: './rubrique.component.html',
  styleUrl: './rubrique.component.scss'
})export class RubriqueComponent implements OnInit{
  constructor(private rubriqueService:RubriqueService,private bulletinPaieService: BulletinPaieService){}

  @Input() allRubriques: Rubrique[] = [];
  @Output() rubriqueSelected = new EventEmitter<Rubrique[]>();
  selectedRubriques: Rubrique[] = [];
  filteredRubriques: Rubrique[] = [];
  isVisible: boolean = false;

  searchCode: string = '';
  searchLibelle: string = '';

  ngOnInit() {
    this.filteredRubriques = this.allRubriques;
  }
  show(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.selectedRubriques = [...this.bulletinPaieService.selectedRubriques];
    this.isVisible = false;
  }
  toggleSelection(rubrique: Rubrique): void {
    const index = this.selectedRubriques.indexOf(rubrique);
    if (index > -1) {
      this.selectedRubriques.splice(index, 1);
    } else
    {
      this.selectedRubriques.push(rubrique);

    }
  }
  isSelected(rubrique: Rubrique): boolean {
    return this.selectedRubriques.indexOf(rubrique) > -1;


  }
  validateSelection(): void {
    const uniqueRubriques = this.bulletinPaieService.selectedRubriques;

    this.selectedRubriques.forEach(rubrique => {
      if (!uniqueRubriques.some(existingRubrique => existingRubrique.code === rubrique.code)) {
        uniqueRubriques.push(rubrique);
      }
    });

    this.bulletinPaieService.selectedRubriques = uniqueRubriques;
    this.rubriqueSelected.emit(this.bulletinPaieService.selectedRubriques);
    this.selectedRubriques = [];
    this.closeModal();
  }

  searchByCode(): void {
    const code = this.searchCode.toLowerCase();
    this.filteredRubriques = this.allRubriques.filter(rubrique => rubrique.code.toString().includes(code));
  }

  searchByLibelle(): void {
    const libelle = this.searchLibelle.toLowerCase();
    this.filteredRubriques = this.allRubriques.filter(rubrique => rubrique.libelle.toLowerCase().includes(libelle));
  }

  resetSearch(): void {
    this.searchCode = '';
    this.searchLibelle = '';
    this.filteredRubriques = this.allRubriques;
  }

  get rubrique(): Rubrique {
    return this.rubriqueService.rubrique;
  }

  set rubrique(value: Rubrique) {
    this.rubriqueService.rubrique = value;
  }

  get rubriques(): Array<Rubrique> {
    return this.rubriqueService.rubriques;
  }

  set rubriques(value: Array<Rubrique>) {
    this.rubriqueService.rubriques = value;
  }


}
