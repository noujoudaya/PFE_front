import {Component, OnInit} from '@angular/core';
import {Employe} from "../../../../services/models/employe.model";
import {ServiceService} from "../../../../services/services/service.service";
import {Service} from "../../../../services/models/service.model";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-service-secretaire',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './service-secretaire.component.html',
  styleUrl: './service-secretaire.component.scss'
})
export class ServiceSecretaireComponent implements OnInit {

  // @ts-ignore
  authenticatedEmploye: Employe;
  services: Service[] = [];

  ngOnInit(): void {
    // @ts-ignore
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      // @ts-ignore
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.findByDepartementCode();
  }

  constructor(private serviceService: ServiceService) {
  }

  public findByDepartementCode(): void {
    this.serviceService.findByDepartementCode(this.authenticatedEmploye.departement.code).subscribe(data => {
      this.services = data;
    })
  }

}
