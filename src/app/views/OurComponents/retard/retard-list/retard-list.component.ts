import { Component, OnInit } from '@angular/core';
import { Retard } from '../../../../services/models/retard.model';
import { RetardService } from '../../../../services/services/retard.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { DepartementService } from '../../../../services/services/departement.service';
import { Departement } from '../../../../services/models/departement.model';
import { Employe } from '../../../../services/models/employe.model';
import { EmployeService } from '../../../../services/services/employe.service';
import { FormsModule } from '@angular/forms';
import { EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-retard-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    FullCalendarModule,
    NgIf,
    NgClass
  ],
  templateUrl: './retard-list.component.html',
  styleUrls: ['./retard-list.component.scss']
})
export class RetardListComponent implements OnInit {

  isSelectionMode: boolean = false;
  selectedRetards: Retard[] = [];

  calendarOptions: any;
  events: EventInput[] = [];

  selectedRetard: Retard | null = null;

  departements: Departement[] = [];
  employesParDepartement: Employe[] = [];
  allEmployess: Employe[] = [];

  labels: string[] = [];

  // @ts-ignore
  selectedDepartement: Departement;
  private searchTerms = new Subject<string>();

  constructor(private retardService: RetardService,
              private departementService: DepartementService,
              private employeService: EmployeService) { }

  ngOnInit(): void {
    this.loadAllEmployees();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.retardService.searchRetards(term))
    ).subscribe(demands => {
      this.retards = demands;
      this.updateEvents();
    });
    this.loadDepartements();
    this.initializeCalendarOptions();
    this.loadRetards();
  }

  public findAll(): void {
    this.retardService.findAll().subscribe(data => {
      this.retards = data;
      this.updateEvents();
    });
  }

  public justifier(retard: Retard): void {
    this.selectedRetard = retard;
    this.retardService.justifier(this.selectedRetard).subscribe(data => {
      console.log(data);
      Swal.fire({
        title: 'Retard justifié !',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.findAll();
      this.selectedRetard = new Retard();
      this.updateAfterJustification();
    });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  loadDepartements(): void {
    this.departementService.findAll().subscribe(data => {
      this.departements = data;
      console.log(this.departements);
    });
  }

  selectDepartement(departement: Departement): void {
    console.log('Département sélectionné :', departement);
    this.selectedDepartement = departement;
    this.findByDepartement(departement);
  }

  findByDepartement(departement: Departement): void {
    this.employeService.findByDepartement(departement).subscribe(data => {
      this.employesParDepartement = data;
      this.labels = this.employesParDepartement.map(emp => `${emp.nom} ${emp.prenom}`);
      this.updateEventsByDepartement();
      this.updateCalendarOptions();
      console.log(this.employesParDepartement);
    });
  }

  loadAllEmployees(): void {
    this.employeService.findAll().subscribe(data => {
      this.allEmployess = data;
      this.labels = this.allEmployess.map(emp => `${emp.nom} ${emp.prenom}`);
      this.updateCalendarOptions();
      this.loadRetards(); // Ensure retards are loaded after employees
      console.log(this.allEmployess);
    });
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [timeGridPlugin],
      initialView: 'timeGridWeek',
      weekends: false,
      locale: frLocale,
      slotLabelContent: (arg: any) => {
        const index = arg.date.getUTCHours();
        if (index < this.labels.length) {
          return { html: `<div class="fw-bold p-1 text-center">${this.labels[index]}</div>` };
        }
        return { html: '' };
      },
      allDaySlot: false,
      slotDuration: '01:00:00',
      slotMinTime: '00:00:00',
      slotMaxTime: `${this.allEmployess.length}:00:00`, // Adjust max time based on all employees
      events: [], // Initialize with empty events
      aspectRatio: 2, // Augmenter le rapport d'aspect pour augmenter la hauteur
      height: 'auto',
      eventContent: this.renderEventContent.bind(this), // Use custom event rendering
      eventClick: this.handleEventClick.bind(this) // Add event click handler
    };
  }

  handleEventClick(info: any): void {
    const selectedEvent = info.event;
    const selectedRetardId = selectedEvent.extendedProps.id;
    const selectedRetard = this.retards.find(retard => retard.id === selectedRetardId) || null;

    if (this.isSelectionMode && selectedRetard) {
      if (this.selectedRetards.includes(selectedRetard)) {
        this.selectedRetards = this.selectedRetards.filter(retard => retard.id !== selectedRetard.id);
      } else {
        this.selectedRetards.push(selectedRetard);
      }
      console.log('Selected retards:', this.selectedRetards);
      // Do not show alert in selection mode
    } else if (selectedRetard) {
      this.selectedRetard = selectedRetard;
      Swal.fire({
        title: 'Retard sélectionné',
        text: `Statut: ${this.selectedRetard.statutRetard}`,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  }

  toggleSelectionMode(): void {
    this.isSelectionMode = !this.isSelectionMode;
    if (!this.isSelectionMode) {
      this.selectedRetards = []; // Clear selections when exiting selection mode
    }
    console.log('Selection mode:', this.isSelectionMode);
  }

  processSelectedRetards(): void {
    if (this.selectedRetards.length > 0) {
      // Implement further processing logic here, e.g., justifying multiple retards
      Swal.fire({
        title: 'Justification des retards ',
        text: `Vous avez sélectionné ${this.selectedRetards.length} retards.`,
        icon: 'info',
        showDenyButton: true,
        denyButtonText: 'Annuler',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with justifying the selected retards
          this.selectedRetards.forEach(retard => this.justifier(retard));
          this.selectedRetards = [];
          this.isSelectionMode = false;
        } else if (result.isDenied) {
          // Do nothing if "Annuler" is clicked
          console.log('Justification annulée');
        }
      });
    } else {
      Swal.fire({
        title: 'Pas de retards sélectionnés !',
        text: 'Veuillez sélectionner des retards',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  renderEventContent(eventInfo: any): { html: string } {
    const duration = eventInfo.event.extendedProps.duration;
    const status = eventInfo.event.extendedProps.status;
    return { html: `<div class="fc-event-title">${status}<br/>Durée: ${duration}</div>` };
  }

  updateCalendarOptions(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.events], // Ensure the events are updated
      slotMaxTime: `${this.labels.length}:00:00` // Adjust slotMaxTime based on current labels
    };
    console.log('Calendar options updated:', this.calendarOptions);
  }

  loadRetards(): void {
    this.retardService.findAll().subscribe(data => {
      this.retards = data;
      this.updateEvents();
    });
  }

  updateEvents(): void {
    this.events = this.retards.map(retard => {
      const employeIndex = this.allEmployess.findIndex(emp => emp.id === retard.employe.id);
      const startTime = new Date(retard.dateRetard);
      const endTime = new Date(retard.dateRetard);

      // Set the start and end time to the specific hour for the employee
      startTime.setHours(employeIndex, 0, 0);
      endTime.setHours(employeIndex + 1, 0, 0);

      const duration = this.calculerDureeRetard(retard.heureDebutTravail, retard.heureArrivee);

      return {
        title: `${retard.statutRetard.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée'}`,
        start: startTime,
        end: endTime,
        color: retard.statutRetard.toString() === "Justifiée" ? 'green' : 'red',
        extendedProps: {
          id: retard.id, // Add ID to extended properties
          status: retard.statutRetard.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée',
          duration: duration
        }
      };
    });
    console.log('Events updated:', this.events);
    this.updateCalendarOptions();
  }

  updateEventsByDepartement(): void {
    const employeIds = this.employesParDepartement.map(emp => emp.id);
    const filteredRetards = this.retards.filter(retard => employeIds.includes(retard.employe.id));
    this.events = filteredRetards.map(retard => {
      const employeIndex = this.employesParDepartement.findIndex(emp => emp.id === retard.employe.id);
      const startTime = new Date(retard.dateRetard);
      const endTime = new Date(retard.dateRetard);

      // Set the start and end time to the specific hour for the employee
      startTime.setHours(employeIndex, 0, 0);
      endTime.setHours(employeIndex + 1, 0, 0);

      const duration = this.calculerDureeRetard(retard.heureDebutTravail, retard.heureArrivee);

      return {
        title: `${retard.statutRetard.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée'}`,
        start: startTime,
        end: endTime,
        color: retard.statutRetard.toString() === "Justifiée" ? 'green' : 'red',
        extendedProps: {
          id: retard.id, // Add ID to extended properties
          status: retard.statutRetard.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée',
          duration: duration // Add duration to extended properties
        }
      };
    });
    console.log('Filtered events by department:', this.events);
    this.updateCalendarOptions();
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

  // New method to update the state after justification
  updateAfterJustification(): void {
    if (this.selectedDepartement) {
      this.findByDepartement(this.selectedDepartement);
    } else {
      this.loadAllEmployees();
      this.loadRetards();
    }
  }
}
