import {Component, OnInit} from '@angular/core';
import {Absence} from "../../../../services/models/absence.model";
import {AbsenceService} from "../../../../services/services/absence.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-absence-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './absence-list.component.html',
  styleUrl: './absence-list.component.scss'
})
export class AbsenceListComponent implements OnInit {

  selectedAbsence : Absence | null = null;

  constructor(private absenceService: AbsenceService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    this.absenceService.findAll().subscribe(data=>{
      this.absences=data;
    })
  }

  public justifier(absence:Absence):void{
    this.selectedAbsence=absence;
    this.absenceService.justifier(this.selectedAbsence).subscribe(data=>{
      console.log(data);
      alert("Absence justifiée");
      this.selectedAbsence = new Absence();
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
