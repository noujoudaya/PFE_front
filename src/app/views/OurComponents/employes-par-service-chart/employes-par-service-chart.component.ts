import { Component, Input, OnInit } from '@angular/core';
import {Chart, ChartConfiguration, registerables} from 'chart.js';
import { ServiceService } from "../../../services/services/service.service";
import { Service } from "../../../services/models/service.model";
import { Employe } from "../../../services/models/employe.model";

@Component({
  selector: 'app-employes-par-service-chart',
  templateUrl: './employes-par-service-chart.component.html',
  standalone: true,
  styleUrls: ['./employes-par-service-chart.component.scss']
})
export class EmployeesByServiceChartComponent implements OnInit {

  authenticatedEmploye: Employe | null = null;
  services: Service[] = [];

  constructor(private serviceService: ServiceService) { }

  ngOnInit(): void {
    // @ts-ignore
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      // @ts-ignore
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.findByDepartementCode();
  }

  createChart() {

    Chart.register(...registerables);

    // @ts-ignore
    const serviceNames = this.services.map(service => service.libelle);
    // @ts-ignore
    const serviceCounts = this.services.map(service => service.count);
    console.log(serviceCounts);

    // @ts-ignore
    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: serviceNames,
        datasets: [{
          label: 'Employés par Service',
          data: serviceCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Pourcentage des employés par service'
          }
        }
      }
    };

    // @ts-ignore
    const ctx = (document.getElementById('employeesByServiceChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      new Chart(ctx, config);
    }
  }

  findByDepartementCode(): void {
    if (this.authenticatedEmploye && this.authenticatedEmploye.departement && this.authenticatedEmploye.departement.code) {
      this.serviceService.findByDepartementCode(this.authenticatedEmploye.departement.code).subscribe((data: Service[]) => {
        this.services = data;
        this.createChart(); // Create the chart after services are loaded
      });
    }
  }
}
