import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TypeCongeService} from "../../../../services/services/type-conge.service";
import {TypeConge} from "../../../../services/models/type-conge.model";
import {DemandeConge} from "../../../../services/models/demande-conge.model";
import {DemandeCongeService} from "../../../../services/services/demande-conge.service";
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {StatutConge} from "../../../../services/enums/statutConge.enum";

@Component({
  selector: 'app-demande-conge-emp-sec',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './demande-conge-emp-sec.component.html',
  styleUrl: './demande-conge-emp-sec.component.scss'
})
export class DemandeCongeEmpSecComponent implements OnInit {

  typesConges: TypeConge[] = [];
  employes: Employe[] = [];

  // @ts-ignore
  authenticatedEmploye: Employe;
  authenticatedEmpDemandes: DemandeConge[] = [];


  joursPris: number = 0;
  joursRestants: number = 0;

  ngOnInit(): void {
    this.loadTypesConges();
    this.loadEmployes();
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.findByEmploye();
    this.calculateDaysDifference("2024-05-17", "2024-05-31");
    this.joursRestants=this.authenticatedEmploye.soldeConge;
  }

  constructor(private typesService: TypeCongeService,
              private demandeCongeService: DemandeCongeService,
              private employeService: EmployeService,
  ) {
  }

  private loadTypesConges(): void {
    this.typesService.findAll().subscribe({
      next: (types) => {
        this.typesConges = types;
        console.log('Types Congés chargés:', this.typesConges);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types congés:', error);
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

  public save(demandeConge: DemandeConge): void {
    // Calculer la durée du congé demandé
    const joursDemandes = this.calculateDaysDifference(demandeConge.dateDebut, demandeConge.dateFin);

    // Vérifier si la durée demandée est inférieure ou égale aux jours restants
    if (joursDemandes <= this.joursRestants) {
      // Si oui, enregistrer la demande de congé
      demandeConge.employe=this.authenticatedEmploye;
      this.demandeCongeService.save(demandeConge).subscribe(data => {
        if (data > 0) {
          alert("Demande enregistrée");
          this.demandeEmploye = new DemandeConge();
          // Actualiser les données après l'enregistrement de la demande
          this.findByEmploye();
        } else {
          alert("Erreur lors de la sauvegarde de la demande");
        }
      });
    } else {
      // Si non, afficher un message d'erreur
      alert("La période demandée dépasse le solde de congé restant.");
    }
  }


  public findByEmploye(): void {
    this.demandeCongeService.findByEmploye(this.authenticatedEmploye).subscribe(data => {
      this.authenticatedEmpDemandes = data;
      console.log('Demandes de congé de l\'employé:', this.authenticatedEmpDemandes); // Vérifier les demandes récupérées

      this.calculateJoursPrisAndRestants();
    })
  }

  private calculateJoursPrisAndRestants(): void {
    // Filtrer les demandes acceptées
    const demandesAcceptees = this.authenticatedEmpDemandes.filter(demande => demande.statutConge.toString() == "Acceptée");

    // Calculer les jours pris pour les demandes acceptées
    const joursPris = demandesAcceptees.reduce((total, demande) => {
      // Vérifier si la date de fin est après la date de début
      if (new Date(demande.dateFin) > new Date(demande.dateDebut)) {
        return total + this.calculateDaysDifference(demande.dateDebut, demande.dateFin);
      } else {
        // Si la date de fin est avant la date de début, il y a probablement une erreur dans les données
        console.error("La date de fin est avant la date de début pour la demande:", demande);
        return total;
      }
    }, 0);

    // Mettre à jour les jours pris et les jours restants
    this.joursPris = joursPris;
    this.joursRestants = this.authenticatedEmploye.soldeConge - this.joursPris;
  }


  calculateDaysDifference(startDateStr: string, endDateStr: string): number {
    console.log("startDateStr:", startDateStr);
    console.log("endDateStr:", endDateStr);

    // Convertir les chaînes de caractères en objets Date
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    console.log("startDate:", startDate);
    console.log("endDate:", endDate);

    // Vérifier si les dates sont valides
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      // Gérer les dates invalides ici (par exemple, afficher un message d'erreur)
      console.error("Les dates sont invalides.");
      return 0;
    }

    // Ajouter un jour à la date de fin pour inclure également ce jour dans le calcul
    endDate.setDate(endDate.getDate() + 1);

    // Calculer la différence de jours en tenant compte de la date de fin
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
  }


  public deleteConge(demande:DemandeConge, index: number): void {

    if (demande.statutConge.toString() == 'Acceptée') {
      alert("Cette demande de congé est déjà acceptée. Vous ne pouvez pas la supprimer.");
      return; // Quitter la fonction car l'utilisateur ne peut pas supprimer une demande acceptée
    }
    // Afficher une boîte de dialogue de confirmation
    const confirmation = confirm("Voulez-vous vraiment supprimer cette demande de congé ?");

    // Vérifier la réponse de l'utilisateur
    if (confirmation) {
      // Si l'utilisateur clique sur "OK", effectuer la suppression
      this.demandeCongeService.deleteConge(demande.dateDemande, demande.employe.id, demande.typeConge.libelle).subscribe(data => {
        if (data > 0) {
          this.authenticatedEmpDemandes.splice(index, 1);
        } else {
          alert("Erreur suppression");
        }
      });
    } else {
      // Si l'utilisateur clique sur "Annuler", ne rien faire
      console.log("Suppression annulée.");
    }
  }



  get demandeEmploye(): DemandeConge {
    return this.demandeCongeService.demandeEmploye;
  }

  set demandeEmploye(value: DemandeConge) {
    this.demandeCongeService.demandeEmploye = value;
  }

  get demandesEmploye(): DemandeConge[] {
    return this.demandeCongeService.demandesEmploye;
  }

  set demandesEmploye(value: DemandeConge[]) {
    this.demandeCongeService.demandesEmploye = value;
  }

}
