import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {TypeAttestation} from "../../../../services/enums/typeAttestation.enum";
import {TypeContrat} from "../../../../services/enums/typeContrat.enum";
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {DemandeAttestationService} from "../../../../services/services/demande-attestation.service";
import {DemandeAttestation} from "../../../../services/models/demande-attestation.model";

@Component({
  selector: 'app-demande-attestation-emp-sec',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './demande-attestation-emp-sec.component.html',
  styleUrl: './demande-attestation-emp-sec.component.scss'
})
export class DemandeAttestationEmpSecComponent implements OnInit {
  ngOnInit(): void {
    this.loadEmployes();
  }

  constructor(private employeService: EmployeService,
              private demandeService: DemandeAttestationService) {
  }

  typesAttest = Object.values(TypeAttestation);
  employes: Employe[] = [];


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

  public save(demande: DemandeAttestation): void {
    this.demandeService.save(demande).subscribe(data => {
      if (data > 0) {
        alert("Demande enregistrée");
        this.demandeEmploye = new DemandeAttestation();
      }
      else {
        alert("Erreur");
      }
    });
  }

  get demandeEmploye(): DemandeAttestation {
    return this.demandeService.demandeAttestation;
  }

  set demandeEmploye(value: DemandeAttestation) {
    this.demandeService.demandeAttestation = value;
  }

  get demandesEmploye(): DemandeAttestation[] {
    return this.demandeService.demandesAttestation;
  }

  set demandesEmploye(value: DemandeAttestation[]) {
    this.demandeService.demandesAttestation = value;
  }

}
