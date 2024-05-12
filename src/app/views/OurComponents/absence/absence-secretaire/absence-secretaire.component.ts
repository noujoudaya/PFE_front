import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Employe} from "../../../../services/models/employe.model";
import {EmployeService} from "../../../../services/services/employe.service";
import {Absence} from "../../../../services/models/absence.model";
import {AbsenceService} from "../../../../services/services/absence.service";
import {AlertComponent} from "@coreui/angular";

@Component({
  selector: 'app-absence-secretaire',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './absence-secretaire.component.html',
  styleUrl: './absence-secretaire.component.scss'
})
export class AbsenceSecretaireComponent implements OnInit {

  employes: Employe[] = [];
  selectedAbsence: Absence = new Absence();

  constructor(private employeService: EmployeService,
              private absenceService: AbsenceService) {
  }

  ngOnInit(): void {
    this.loadEmployes();
    this.findAll();
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

  public save(absence: Absence): void {
    this.absenceService.save(absence).subscribe(data => {
      if (data > 0) {
        this.absencesSec.push({...this.absenceSec});
        alert("Absence enregistrée !");
        this.absenceSec = new Absence();
      } else {
        alert("Erreur");
      }
    })
  }

  public deleteByDateAndEmploye(date: string, employe: Employe,index:number): void {
    this.absenceService.deleteByDateAbsenceAndEmploye(date, employe).subscribe(data => {
      if (data > 0){
        this.absencesSec.splice(index, 1);
        alert("Absence supprimée !");
      }
      else {
        alert("Erreur");
      }
    })
  }

  public findAll(): void {
    this.absenceService.findAll().subscribe(data => {
      this.absencesSec = data;
    })
  }

  get absenceSec(): Absence {
    return this.absenceService.absenceSec;
  }

  set absenceSec(value: Absence) {
    this.absenceService.absenceSec = value;
  }

  get absencesSec(): Absence[] {
    return this.absenceService.absencesSec;
  }

  set absencesSec(value: Absence[]) {
    this.absenceService.absencesSec = value;
  }

}
