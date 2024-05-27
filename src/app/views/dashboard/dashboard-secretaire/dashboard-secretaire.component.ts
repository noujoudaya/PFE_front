import {Component, OnInit} from '@angular/core';
import {Employe} from "../../../services/models/employe.model";
import {
    AvatarComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent, TableDirective
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {NgForOf} from "@angular/common";
import {Absence} from "../../../services/models/absence.model";
import {Retard} from "../../../services/models/retard.model";
import {AbsenceService} from "../../../services/services/absence.service";
import {RetardService} from "../../../services/services/retard.service";
import {
  EmployeesByServiceChartComponent
} from "../../OurComponents/employes-par-service-chart/employes-par-service-chart.component";
import {Service} from "../../../services/models/service.model";
import {ServiceService} from "../../../services/services/service.service";
import {EmployeService} from "../../../services/services/employe.service";


@Component({
  selector: 'app-dashboard-secretaire',
  standalone: true,
  imports: [
    AvatarComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    IconDirective,
    NgForOf,
    RowComponent,
    TableDirective,
    EmployeesByServiceChartComponent,
  ],
  templateUrl: './dashboard-secretaire.component.html',
  styleUrl: './dashboard-secretaire.component.scss'
})
export class DashboardSecretaireComponent implements OnInit{
  // @ts-ignore
  authenticatedEmploye: Employe;
  absencesAuj : Absence[] = [];
  retardsAuj: Retard[] = [];
  services: Service[] = [];



  constructor(private absenceService:AbsenceService,
              private retardService: RetardService,
              private serviceService:ServiceService) {

  }

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.getAbsencesAujourdhui();
    this.getRetardsAujourdhui();

    this.findByDepartementCode();

  }



  isToday(date: string): boolean {
    const today = new Date();
    const absenceDate = new Date(date);
    return (
      today.getFullYear() === absenceDate.getFullYear() &&
      today.getMonth() === absenceDate.getMonth() &&
      today.getDate() === absenceDate.getDate()
    );
  }

  getAbsencesAujourdhui(): void {
    this.absenceService.findByEmployeDepartement(this.authenticatedEmploye.departement).subscribe((absences: any[]) => {
      // Filtrer les absences pour ne conserver que celles d'aujourd'hui
      this.absencesAuj = absences.filter(absence => this.isToday(absence.dateAbsence));
    });
  }

  getRetardsAujourdhui(): void {
    this.retardService.findByEmployeDepartement(this.authenticatedEmploye.departement).subscribe((retards: any[]) => {
      // Filtrer les absences pour ne conserver que celles d'aujourd'hui
      this.retardsAuj = retards.filter(retard => this.isToday(retard.dateRetard));
    });
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

  public findByDepartementCode(): void {
    this.serviceService.findByDepartementCode(this.authenticatedEmploye.departement.code).subscribe(data => {
      this.services = data;
    })
  }

}
