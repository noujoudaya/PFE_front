import {Component, OnInit} from '@angular/core';
import {Service} from "../../../../services/models/service.model";
import {FonctionService} from "../../../../services/services/fonction.service";
import {Fonction} from "../../../../services/models/fonction.model";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Departement} from "../../../../services/models/departement.model";
import {ServiceService} from "../../../../services/services/service.service";

@Component({
  selector: 'app-fonction-list',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf
    ],
  templateUrl: './fonction-list.component.html',
  styleUrl: './fonction-list.component.scss'
})
export class FonctionListComponent implements OnInit {

  updatedLibelle!: string;
  services: Service[] = [];

  constructor(private fonctionService: FonctionService,
              private serviceService: ServiceService) {
  }

  ngOnInit(): void {
    this.findAll();
    this.loadServices();
  }

  public findAll(): void {
    this.fonctionService.findAll().subscribe(data => this.fonctions = data);
  }

  private loadServices(): void {
    this.serviceService.findAll().subscribe({
      next: (services) => {
        this.services = services;
        console.log('Services chargés:', this.services);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
      }
    });
  }

  public deleteByCode(fonction: Fonction, index: number): void {
    this.fonctionService.deleteByCode(fonction.code).subscribe(data => {
      if (data > 0) {
        this.fonctions.splice(index, 1);
      } else {
        alert('error accured');
      }
    });
  }

  public update(fonction: Fonction): void {
    this.fonction.libelle = this.updatedLibelle;
    this.fonction.code = fonction.code;

    this.fonctionService.update().subscribe(data => {
      if (data > 0) {
        const index = this.fonctions.findIndex(s => s.id === fonction.id);
        if (index !== -1) {
          this.fonctions[index].libelle = this.fonction.libelle;
          // Update any other properties as needed
          alert('UPDATE SUCCESS');
          this.updatedLibelle = '';
        } else {
          alert('Service not found');
        }
      } else {
        alert('Error occurred');
      }
      this.fonctionService.fonction = new Fonction();
    });
  }

  public save(): void {

    this.fonction.code = this.fonction.libelle;
    this.fonctionService.save().subscribe(data => {
      if (data > 0) {
        this.fonctions.push({...this.fonction});
        alert('SAVE SUCCESS');
      } else if (data === 0){
        alert('Fonction existe déjà');
      }
      else {
        alert('service nexiste pas');
      }
      this.fonctionService.fonction = new Fonction();
    });
  }

  public confirmDelete(fonction: Fonction, index: number): void {
    if (confirm('Are you sure you want to delete this fonction?')) {
      this.deleteByCode(fonction, index);
    }
  }


  get fonction(): Fonction {
    return this.fonctionService.fonction;
  }

  set fonction(value: Fonction) {
    this.fonctionService.fonction = value;
  }

  get fonctions(): Array<Fonction> {
    return this.fonctionService.fonctions;
  }

  set fonctions(value: Array<Fonction>) {
    this.fonctionService.fonctions = value;
  }
}
