import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {Retard} from "../../../../services/models/retard.model";
import {RetardService} from "../../../../services/services/retard.service";

@Component({
  selector: 'app-retard-secretaire',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './retard-secretaire.component.html',
  styleUrl: './retard-secretaire.component.scss'
})
export class RetardSecretaireComponent implements OnInit {

  employes: Employe[] = [];

  ngOnInit(): void {
    this.loadEmployes();
    this.findAll();
  }

  constructor(private employeService: EmployeService,
              private retardService: RetardService) {
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

  public save(retard: Retard): void {
    retard.dateRetard=new Date().toISOString().split('T')[0]; // Initialise avec la date actuelle
    this.retardService.save(retard).subscribe(data => {
      if (data > 0) {
        this.retardsSec.push({...this.retardSec});
        alert("Retard enregistré !");
        this.retardSec = new Retard();
      } else {
        alert("Erreur");
      }
    })
  }

  public findAll(): void {
    this.retardService.findAll().subscribe(data => {
      this.retardsSec = data;
    })
  }

  public deleteByDateAndEmploye(date: string, employe: Employe, index: number): void {
    this.retardService.deleteByDateRetardAndEmploye(date, employe).subscribe(data => {
      if (data > 0){
        this.retardsSec.splice(index, 1);
        alert("Retard supprimé !");
      }
      else {
        alert("erreur");
      }
    })
  }

  public calculerDureeRetard(heureDebutTravail: string, heureArrive: string): string {
    const [heureDebut, minuteDebut] = heureDebutTravail.split(':').map(Number);
    const [heureArrivee, minuteArrivee] = heureArrive.split(':').map(Number);

    const debut = new Date(0, 0, 0, heureDebut, minuteDebut);
    const arrivee = new Date(0, 0, 0, heureArrivee, minuteArrivee);

    const diff = arrivee.getTime() - debut.getTime(); // Différence en millisecondes
    const minutesRetard = Math.floor(diff / 60000); // Convertir en minutes

    return minutesRetard > 0 ? `${minutesRetard} minutes` : 'Aucun retard';
  }

  get retardSec(): Retard {
    return this.retardService.retardSec;
  }

  set retardSec(value: Retard) {
    this.retardService.retardSec = value;
  }

  get retardsSec(): Retard[] {
    return this.retardService.retardsSec;
  }

  set retardsSec(value: Retard[]) {
    this.retardService.retardsSec = value;
  }

}
