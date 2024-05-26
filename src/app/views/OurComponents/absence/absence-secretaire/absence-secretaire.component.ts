import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Employe} from "../../../../services/models/employe.model";
import {EmployeService} from "../../../../services/services/employe.service";
import {Absence} from "../../../../services/models/absence.model";
import {AbsenceService} from "../../../../services/services/absence.service";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import Swal from "sweetalert2";

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

  // @ts-ignore
  authenticatedEmploye: Employe;

  employes: Employe[] = [];
  selectedAbsence: Absence = new Absence();

  private searchTerms = new Subject<string>();

  constructor(private employeService: EmployeService,
              private absenceService: AbsenceService) {
  }

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      // @ts-ignore
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.loadEmployes();
    //this.findAll();
    this.findByEmployeDepartement();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.absenceService.searchAbsences(term))
    ).subscribe(demands => {
      this.absencesSec = demands;
    });
  }

  private loadEmployes(): void {
    this.employeService.findByDepartement(this.authenticatedEmploye.departement).subscribe({
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
    absence.dateAbsence=new Date().toISOString().split('T')[0];
    this.absenceService.save(absence).subscribe(data => {
      if (data > 0) {
        this.absencesSec.push({...this.absenceSec});
        Swal.fire({
          title: 'Absence enregistrée !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.findByEmployeDepartement();
        this.absenceSec = new Absence();
      } else {
        Swal.fire({
          title: 'Oops! Une erreur est survenue',
          icon: 'error',
        });
      }
    })
  }

  public deleteByDateAndEmploye(date: string, employe: Employe, index: number): void {
    Swal.fire({
      title: 'Voulez-vous vraiment supprimer cette absence ?',
      showDenyButton: true,
      denyButtonText: 'Annuler',
      confirmButtonText: 'Supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.absenceService.deleteByDateAbsenceAndEmploye(date, employe).subscribe(data => {
          if (data > 0) {
            this.absencesSec.splice(index, 1);
            Swal.fire({
              title: 'Absence supprimée !',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.findAll();
          } else {
            Swal.fire({
              title: 'Oops! Une erreur est survenue',
              icon: 'error',
            });
          }
        });
      }
    });
  }


  public findAll(): void {
    this.absenceService.findAll().subscribe(data => {
      this.absencesSec = data;
    })
  }

  public findByEmployeDepartement():void{
    this.absenceService.findByEmployeDepartement(this.authenticatedEmploye.departement).subscribe(data=>{
      this.absencesSec=data;
    })
  }
  search(term: string): void {
    this.searchTerms.next(term);
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
