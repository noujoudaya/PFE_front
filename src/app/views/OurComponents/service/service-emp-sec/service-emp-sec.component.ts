import {Component, OnInit} from '@angular/core';
import {ServiceService} from "../../../../services/services/service.service";
import {Service} from "../../../../services/models/service.model";
import {Departement} from "../../../../services/models/departement.model";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-service-emp-sec',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './service-emp-sec.component.html',
  styleUrl: './service-emp-sec.component.scss'
})
export class ServiceEmpSecComponent implements OnInit {
  ngOnInit(): void {
    this.findAll();
  }

  constructor(private serviceService: ServiceService) {
  }

  public findAll(): void {
    // @ts-ignore
    this.serviceService.findAll().subscribe(data =>
      this.services = data);
  }

  get services(): Array<Service> {
    for (let service of this.serviceService.services) {
      if (service.departement == null) {
        service.departement = new Departement();
      }
    }
    return this.serviceService.services;
  }

  set services(value: Service[]) {
    this.serviceService.services = value;
  }

}
