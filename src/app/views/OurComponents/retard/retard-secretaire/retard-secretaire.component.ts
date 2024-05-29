import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EmployeService} from "../../../../services/services/employe.service";
import {Employe} from "../../../../services/models/employe.model";
import {Retard} from "../../../../services/models/retard.model";
import {RetardService} from "../../../../services/services/retard.service";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import Swal from "sweetalert2";
import {Page} from "../../../../services/models/page.model";
import {Absence} from "../../../../services/models/absence.model";
import {Departement} from "../../../../services/models/departement.model";

@Component({
  selector: 'app-retard-secretaire',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './retard-secretaire.component.html',
  styleUrl: './retard-secretaire.component.scss'
})
export class RetardSecretaireComponent implements OnInit {

  retardsPage: Page<Retard> = new Page<Retard>();

  // @ts-ignore
  authenticatedEmploye: Employe;
  employes: Employe[] = [];

  private searchTerms = new Subject<string>();

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      // @ts-ignore
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.loadEmployes();
    this.getRetardsPage(this.authenticatedEmploye.departement,0,5);
   // this.findByEmployeDepartement();
   // this.findAll();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.retardService.searchRetards(term))
    ).subscribe(demands => {
      this.retardsPage.content = demands;
    });
  }

  constructor(private employeService: EmployeService,
              private retardService: RetardService) {
  }

  getPageNumbers(): number[] {
    const totalPages = this.retardsPage.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  getRetardsPage(departement:Departement,page: number, size: number): void {
    this.retardService.getRetards(departement,page, size).subscribe({
      next: (page) => {
        this.retardsPage = page;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des retards paginés:', error);
      }
    });
  }

  private loadEmployes(): void {
    this.employeService.findByDepartement(this.authenticatedEmploye.departement).subscribe({
      next: (employes) => {
        this.employes = employes;
        console.log('Employés chargés:', this.employes);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    });
  }

  public save(retard: Retard): void {
    retard.dateRetard = new Date().toISOString().split('T')[0]; // Initialise avec la date actuelle
    this.retardService.save(retard).subscribe(data => {
      if (data > 0) {
        this.retardsSec.push({...this.retardSec});
        Swal.fire({
          title: 'Retard enregistré !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.findByEmployeDepartement();
        this.retardSec = new Retard();
      } else {
        Swal.fire({
          title: 'Oops! Une erreur est survenue',
          icon: 'error',
        });
      }
    })
  }

  public findAll(): void {
    this.retardService.findAll().subscribe(data => {
      this.retardsSec = data;
    })
  }

  public deleteByDateAndEmploye(date: string, employe: Employe, index: number): void {
    Swal.fire({
      title: 'Voulez-vous vraiment supprimer ce retard ?',
      showDenyButton: true,
      denyButtonText: 'Annuler',
      confirmButtonText: 'Supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.retardService.deleteByDateRetardAndEmploye(date, employe).subscribe(data => {
          if (data > 0) {
            this.retardsSec.splice(index, 1);
            Swal.fire({
              title: 'Retard supprimé !',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.findAll();
          } else {
            Swal.fire({
              title: 'Oops! Une erreur est survenue',
              icon: 'error',
            });
          }
        });
      }
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

  public findByEmployeDepartement():void{
    this.retardService.findByEmployeDepartement(this.authenticatedEmploye.departement).subscribe(data=>{
      this.retardsSec=data;
    })
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  get retardSec(): Retard {
    return this.retardService.retardSec;
  }

  set retardSec(value: Retard) {
    this.retardService.retardSec = value;
  }

  get retardsSec(): Retard[] {
    return this.retardService.retardsSec;
  }

  set retardsSec(value: Retard[]) {
    this.retardService.retardsSec = value;
  }

}
