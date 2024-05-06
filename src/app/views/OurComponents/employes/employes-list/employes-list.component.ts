import {Component, OnInit} from '@angular/core';
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {NgForOf} from "@angular/common";
import {Genre} from "../../../../services/enums/genre.enum";
import {FormsModule} from "@angular/forms";
import {SituationFamiliale} from "../../../../services/enums/situationFamiliale.enum";
import {StatutEmploye} from "../../../../services/enums/statutEmploye.enum";
import {Designation} from "../../../../services/enums/designation.enum";

@Component({
  selector: 'app-employes-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './employes-list.component.html',
  styleUrl: './employes-list.component.scss'
})
export class EmployesListComponent implements OnInit {

  genres = Object.values(Genre);
  situations = Object.values(SituationFamiliale);
  statuts = Object.values(StatutEmploye)
  designations = Object.values(Designation)

  ngOnInit(): void {
    this.findAll();
  }

  constructor(private service: EmployeService) {
  }

  public findAll(): void {
    this.service.findAll().subscribe(data => {
        console.log(data);
        this.employes = data;
      }
    );
  }

  public save(): void {
    this.service.save().subscribe(data => {
      if (data > 0) {
        this.employes.push({...this.employe});
        this.employe = new Employe();
        alert("Employé enregisté avec succès");
      } else {
        alert("Erreur");
      }
    })
  }

  public deleteByCin(employe: Employe, index: number): void {
    if (employe.cin != null) {
      this.service.deleteByCin(employe.cin).subscribe(data => {
          if (data > 0) {
            this.employes.splice(index, 1);
          } else {
            alert("Erreur suppression");
          }
        }
      );
    }
  }

  get employe(): Employe {
    return this.service.employe;
  }

  set employe(value: Employe) {
    this.service.employe = value;
  }

  get employes(): Employe[] {
    return this.service.employes;
  }

  set employes(value: Employe[]) {
    this.service.employes = value;
  }
}
