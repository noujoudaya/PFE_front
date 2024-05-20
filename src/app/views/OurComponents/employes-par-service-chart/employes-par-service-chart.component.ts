import {Component, OnInit} from '@angular/core';
import {ServiceService} from "../../../services/services/service.service";
import {Service} from "../../../services/models/service.model";
import {Employe} from "../../../services/models/employe.model";
import {EmployeService} from "../../../services/services/employe.service";
import {catchError, forkJoin, of} from "rxjs";
import {ChartData, ChartOptions, ChartType} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {Genre} from "../../../services/enums/genre.enum";

@Component({
  selector: 'app-employes-par-service-chart',
  templateUrl: './employes-par-service-chart.component.html',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  styleUrls: ['./employes-par-service-chart.component.scss']
})
export class EmployeesByServiceChartComponent implements OnInit {

  // @ts-ignore
  authenticatedEmploye: Employe;
  services: Service[] = [];
  serviceEmployeeCounts: { libelle: string, count: number }[] = [];

  doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };
  doughnutChartType: ChartType = 'doughnut';

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Nombre d\'employés par service'
      }
    }
  };

  maleFemaleChartData: ChartData<'doughnut'> = {
    labels: ['Hommes', 'Femmes'],
    datasets: []
  };
  maleFemaleChartType: ChartType = 'doughnut';

  maleFemaleChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Répartition des employés par genre'
      }
    }
  };

  constructor(private serviceService: ServiceService,
              private employeService:EmployeService) { }

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.findByDepartementCode();
    this.findByDepartement();
  }

  findByDepartementCode(): void {
    if (this.authenticatedEmploye && this.authenticatedEmploye.departement && this.authenticatedEmploye.departement.code) {
      this.serviceService.findByDepartementCode(this.authenticatedEmploye.departement.code).subscribe((data: Service[]) => {
        this.services = data;
        this.countEmployeesInServices();

      });
    }
  }

  countEmployeesInServices(): void {
    const observables = this.services.map(service =>
      this.employeService.countEmployeByService(service).pipe(
        catchError(() => of(0)) // Handle errors gracefully
      )
    );

    forkJoin(observables).subscribe(counts => {
      this.serviceEmployeeCounts = this.services.map((service, index) => ({
        libelle: service.libelle,
        count: counts[index]
      }));
      console.log(this.serviceEmployeeCounts);
      this.updateChartData();
    });
  }

  findByDepartement():void{
    this.employeService.findByDepartement(this.authenticatedEmploye.departement).subscribe(employes=>{
      const maleCount = employes.filter(employe => employe.genre === Genre.HOMME).length;
      const femaleCount = employes.filter(employe => employe.genre === Genre.FEMME).length;

      // Mettre à jour les données de la deuxième charte
      this.updateMaleFemaleChartData(maleCount, femaleCount);
    });
  }

  updateChartData(): void {
    const labels = this.serviceEmployeeCounts.map(item => item.libelle);
    const data = this.serviceEmployeeCounts.map(item => item.count);
    const backgroundColor = [
      'rgba(243,7,55,0.2)',
      'rgba(13,145,234,0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'
    ];
    const borderColor = [
      'rgb(224,14,58)',
      'rgb(11,145,236)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ];

    this.doughnutChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    };
  }


  updateMaleFemaleChartData(maleCount: number, femaleCount: number): void {
    const data = [maleCount, femaleCount];
    const backgroundColor = ['rgba(0, 123, 255, 0.2)', 'rgba(255, 99, 132, 0.2)'];
    const borderColor = ['rgb(0, 123, 255)', 'rgb(255, 99, 132)'];

    this.maleFemaleChartData = {
      labels: ['Hommes', 'Femmes'],
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    };
  }



}
