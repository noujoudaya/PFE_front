import {Component, OnInit} from '@angular/core';
import {ServiceService} from "../../../../services/services/service.service";
import {Service} from "../../../../services/models/service.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent implements OnInit {

  updatedLibelle!: string;

  constructor(private serviceService: ServiceService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

public findAll(): void {
    this.serviceService.findAll().subscribe(data => this.services = data);
  }

public deleteByCode(service: Service, index: number): void {
    this.serviceService.deleteByCode(service.code).subscribe(data => {
      if (data > 0) {
        this.services.splice(index, 1);
      } else {
        alert('error accured');
      }
    });
  }

public update(service: Service): void {
    this.service.libelle = this.updatedLibelle;
    this.service.code = service.code;

    this.serviceService.update().subscribe(data => {
      if (data > 0) {
        const index = this.services.findIndex(s => s.id === service.id);
        if (index !== -1) {
          this.services[index].libelle = this.service.libelle;
          // Update any other properties as needed
          alert('UPDATE SUCCESS');
          this.updatedLibelle = '';
        } else {
          alert('Department not found');
        }
      } else {
        alert('Error occurred');
      }
      this.serviceService.service = new Service();
    });
  }

public save(): void {

    this.service.code = this.service.libelle;
    this.serviceService.save().subscribe(data => {
      if (data > 0) {
        this.services.push({...this.service});
        alert('SAVE SUCCESS');
      } else if (data === 0){
        alert('Service existe déjà');
      }
      else {
        alert('departement nexiste pas');
      }
      this.serviceService.service = new Service();
    });
  }

public confirmDelete(service: Service, index: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
    this.deleteByCode(service, index);
  }
}


  get service(): Service {
    return this.serviceService.service;
  }

  set service(value: Service) {
    this.serviceService.service = value;
  }

  get services(): Array<Service> {
    return this.serviceService.services;
  }

  set services(value: Array<Service>) {
    this.serviceService.services = value;
  }
}
