import {Component, OnInit} from '@angular/core';
import {Absence} from "../../../../services/models/absence.model";
import {AbsenceService} from "../../../../services/services/absence.service";
import {NgForOf} from "@angular/common";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import Swal from "sweetalert2";
import {DepartementService} from "../../../../services/services/departement.service";
import {Departement} from "../../../../services/models/departement.model";
import {Employe} from "../../../../services/models/employe.model";
import {EmployeService} from "../../../../services/services/employe.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-absence-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './absence-list.component.html',
  styleUrl: './absence-list.component.scss'
})
export class AbsenceListComponent implements OnInit {

  selectedAbsence : Absence | null = null;

  departements:Departement[]=[];

  employesParDepartement:Employe[]=[];

  dateDebut:string='';
  dateFin:string='';

  private searchTerms = new Subject<string>();

  constructor(private absenceService: AbsenceService,
              private departementService:DepartementService,
              private employeService:EmployeService) {
  }

  ngOnInit(): void {
    this.findAll();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.absenceService.searchAbsences(term))
    ).subscribe(demands => {
      this.absences = demands;
    });
    this.loadDepartements();
  }

  public findAll(): void {
    this.absenceService.findAll().subscribe(data=>{
      this.absences=data;
      console.log(this.absences);
    })
  }

  public justifier(absence:Absence):void{
    this.selectedAbsence=absence;
    this.absenceService.justifier(this.selectedAbsence).subscribe(data=>{
      console.log(data);
      Swal.fire({
        title: 'Absence justifiée !',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.findAll();
      this.selectedAbsence = new Absence();
    })
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  loadDepartements():void{
    this.departementService.findAll().subscribe(data=>{
      this.departements=data;
      console.log(this.departements);
    })
  }

  selectDepartement(departement: Departement): void {
    // Faites ce que vous voulez avec le département sélectionné, comme l'affecter à une variable ou effectuer une action
    console.log('Département sélectionné :', departement);
    this.findByDepartement(departement);
  }

  findByDepartement(departement:Departement):void{
    this.employeService.findByDepartement(departement).subscribe(data=>{
      this.employesParDepartement=data;
      console.log(this.employesParDepartement);
    })
  }


  get absence(): Absence {
    return this.absenceService.absence;
  }

  set absence(value: Absence) {
    this.absenceService.absence = value;
  }

  get absences(): Absence[] {
    return this.absenceService.absences;
  }

  set absences(value: Absence[]) {
    this.absenceService.absences = value;
  }

}
