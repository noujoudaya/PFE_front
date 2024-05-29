import {Component, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {BulletinPaieService} from "../../../../services/services/bulletin-paie.service";
import {Departement} from "../../../../services/models/departement.model";
import {BulletinPaie} from "../../../../services/models/bulletin-paie.model";
import {EmployeService} from "../../../../services/services/employe.service";
import {RubriqueService} from "../../../../services/services/rubrique.service";
import {RubriqueComponent} from "../../rubrique/rubrique.component";
import {Rubrique} from "../../../../services/models/rubrique.model";
import {BulletinPaieRubrique} from "../../../../services/models/bulletin-paie-rubrique.model";
import {EntrepriseService} from "../../../../services/services/entreprise.service";
import {Employe} from "../../../../services/models/employe.model";

@Component({
  selector: 'app-bulletin-paie-create',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    RubriqueComponent
  ],
  templateUrl: './bulletin-paie-create.component.html',
  styleUrl: './bulletin-paie-create.component.scss'
})

export class BulletinPaieCreateComponent {
  @ViewChild(RubriqueComponent) rubriquesModal!: RubriqueComponent;
  rubriques: Rubrique[] = [];
  bulletinPaieRubriques:BulletinPaieRubrique[]=[];
  calculatedBulletin=new BulletinPaie();
  months: string[] = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  matricule!: number ;
  nom: string = '';
  prenom: string = '';
  showContent: boolean = false;
  showContent1: boolean = false;
  currentYear = new Date().getFullYear();



  constructor(private bulletinPaieService: BulletinPaieService, private employeService: EmployeService, private rubriqueService: RubriqueService,private entrepriseService :EntrepriseService) {


  }


  searchEmploye(): void {
    const matriculeNumber = this.matricule;
    if (!isNaN(matriculeNumber)) {
      this.employeService.findByMatricule(matriculeNumber).subscribe(data => {
        if (data) {
          this.matricule=data.matricule;
          this.nom = data.nom;
          this.prenom = data.prenom;
          this.bulletinPaie.employe = data;
          this.showContent = true;
          this.searchEntreprise();

        } else {
          alert("Employe not found");
        }
      });
    } else {
      alert("Invalid matricule");
    }
  }
  searchEntreprise(): void {

      this.entrepriseService.searchEntreprise("1234").subscribe(data => {
        if (data) {

          this.bulletinPaie.entreprise = data;

        } else {
          alert("entreprise not found");
        }
      });
    }


  openModal() {
    this.fetchRubriques(); // Fetch rubriques list
    this.rubriquesModal.show(); // Call method to show the modal
  }

  fetchRubriques() {
    this.rubriqueService.findAll().subscribe(rubriques => {
      console.log(rubriques);
      this.rubriques = rubriques;
    });
  }

  handleRubriquesSelected(selectedRubriques: Rubrique[]) {
    const uniqueRubriques = this.bulletinPaieService.selectedRubriques;

    // Ensure no duplicate rubriques are added to the selectedRubriques
    selectedRubriques.forEach(rubrique => {
      if (!uniqueRubriques.some(existingRubrique => existingRubrique.code === rubrique.code)) {
        uniqueRubriques.push(rubrique);
      }
    });

    this.selectedRubriques = uniqueRubriques;

    // Update bulletinPaieRubriques with new selected rubriques
    this.selectedRubriques.forEach(rubrique => {
      if (!this.bulletinPaieRubriques.some(bpr => bpr.rubrique.code === rubrique.code)) {
        const bulletinPaieRubrique: BulletinPaieRubrique = {
          montant: 0,
          nombre: 0,
          rubrique: rubrique,

        };
        this.bulletinPaieRubriques.push(bulletinPaieRubrique);
      }
    });
    this.bulletinPaie.bulletinPaieRubriques = this.bulletinPaieRubriques;

  }

 /* generer() {

    this.bulletinPaieService.save().subscribe(data=>{
      if (data > 0) {
        alert("bulletin enregisté avec succès");
      } else {
        alert("existe deja un bulletin avec ce code");
      }
    })
  }*/

  calculer() {
    console.log(this.calculatedBulletin)
    this.bulletinPaieService.calculer(this.bulletinPaie).subscribe(data=>{
      console.log(data);
      this.calculatedBulletin=data;
      this.showContent1 = true;
    })
  }
  generer() {
    this.bulletinPaieService.generer(this.bulletinPaie).subscribe(data=>{
      console.log(data);
      if (data > 0) {
        alert("bulletin enregisté avec succès");
      } else {
        alert("existe deja un bulletin avec ce code");
      }
      this.showContent1 = false;
      this.showContent =false ;
      this.bulletinPaie.employe=new Employe();
      this.bulletinPaie=new BulletinPaie();
      this.calculatedBulletin=new BulletinPaie();
      
    })
  }
  modifier() {
    this.showContent1 = false;
  }

  get bulletinPaie(): BulletinPaie {
    return this.bulletinPaieService.bulletinPaie;
  }

  set bulletinPaie(value: BulletinPaie) {
    this.bulletinPaieService.bulletinPaie = value;
  }

  get bulletinPaies(): Array<BulletinPaie> {
    return this.bulletinPaieService.bulletinPaies;
  }

  set bulletinPaies(value: Array<BulletinPaie>) {
    this.bulletinPaieService.bulletinPaies = value;
  }
  get selectedRubriques(): Array<Rubrique> {
    return this.bulletinPaieService.selectedRubriques;
  }

  set selectedRubriques(value: Array<Rubrique>) {
    this.bulletinPaieService.selectedRubriques = value;
  }



}
