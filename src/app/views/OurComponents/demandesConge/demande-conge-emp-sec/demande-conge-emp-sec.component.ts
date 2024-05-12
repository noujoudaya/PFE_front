import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TypeCongeService} from "../../../../services/services/type-conge.service";
import {TypeConge} from "../../../../services/models/type-conge.model";
import {DemandeConge} from "../../../../services/models/demande-conge.model";
import {DemandeCongeService} from "../../../../services/services/demande-conge.service";
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";

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

  ngOnInit(): void {
    this.loadTypesConges();
    this.loadEmployes();
  }

  constructor(private typesService: TypeCongeService,
              private demandeCongeService: DemandeCongeService,
              private employeService: EmployeService) {
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
    this.demandeCongeService.save(demandeConge).subscribe(data => {
      if (data > 0) {
        alert("Demande enregistrée");
        this.demandeEmploye = new DemandeConge();
      } else {
        alert("Erreur lors de la sauvegarde de la demande");
      }
    });
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
