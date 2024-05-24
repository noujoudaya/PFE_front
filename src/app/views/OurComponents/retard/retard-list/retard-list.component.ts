import {Component, OnInit} from '@angular/core';
import {RetardService} from "../../../../services/services/retard.service";
import {Retard} from "../../../../services/models/retard.model";
import {NgForOf} from "@angular/common";
import {debounceTime, distinctUntilChanged, Subject, switchMap} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-retard-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './retard-list.component.html',
  styleUrl: './retard-list.component.scss'
})
export class RetardListComponent implements OnInit {
  ngOnInit(): void {
    this.findAll();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.retardService.searchRetards(term))
    ).subscribe(demands => {
      this.retards = demands;
    });
  }

  private searchTerms = new Subject<string>();

  selectedRetard: Retard | null = null;

  constructor(private retardService: RetardService) {
  }

  public findAll(): void {
    this.retardService.findAll().subscribe(data => {
      this.retards = data;
    })
  }

  search(term: string): void {
    this.searchTerms.next(term);
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

  public justifier(retard: Retard): void {
    this.selectedRetard = retard;
    this.retardService.justifier(this.selectedRetard).subscribe(data => {
      if (data != null)
        console.log(data);
      Swal.fire({
        title: 'Retard justifié !',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.findAll();
      this.selectedRetard = new Retard();
    });
  }

  get retard(): Retard {
    return this.retardService.retard;
  }

  set retard(value: Retard) {
    this.retardService.retard = value;
  }

  get retards(): Retard[] {
    return this.retardService.retards;
  }

  set retards(value: Retard[]) {
    this.retardService.retards = value;
  }
}
