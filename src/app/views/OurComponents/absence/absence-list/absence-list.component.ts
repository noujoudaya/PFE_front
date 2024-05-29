import { Component, OnInit } from '@angular/core';
import { Absence } from '../../../../services/models/absence.model';
import { AbsenceService } from '../../../../services/services/absence.service';
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
  selector: 'app-absence-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    FullCalendarModule,
    NgIf,
    NgClass
  ],
  templateUrl: './absence-list.component.html',
  styleUrls: ['./absence-list.component.scss']
})
export class AbsenceListComponent implements OnInit {

  isSelectionMode: boolean = false;
  selectedAbsences: Absence[] = [];

  calendarOptions: any;
  events: EventInput[] = [];

  selectedAbsence: Absence | null = null;

  departements: Departement[] = [];
  employesParDepartement: Employe[] = [];
  allEmployess: Employe[] = [];

  labels: string[] = [];
  dateDebut: string = '';
  dateFin: string = '';

  // @ts-ignore
  selectedDepartement: Departement;
  private searchTerms = new Subject<string>();

  constructor(private absenceService: AbsenceService,
              private departementService: DepartementService,
              private employeService: EmployeService) { }

  ngOnInit(): void {
    this.loadAllEmployees();
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.absenceService.searchAbsences(term))
    ).subscribe(demands => {
      this.absences = demands;
      this.updateEvents();
    });
    this.loadDepartements();
    this.initializeCalendarOptions();
    this.loadAbsences();
  }

  public findAll(): void {
    this.absenceService.findAll().subscribe(data => {
      this.absences = data;
      this.updateEvents();
    });
  }

  public justifier(absence: Absence): void {
    this.selectedAbsence = absence;
    this.absenceService.justifier(this.selectedAbsence).subscribe(data => {
      console.log(data);
      Swal.fire({
        title: 'Absence justifiée !',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.findAll();
      this.selectedAbsence = new Absence();
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
      this.loadAbsences(); // Ensure absences are loaded after employees
      console.log(this.allEmployess);
    });
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [timeGridPlugin],
      initialView: 'timeGridWeek',
      weekends: true,
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
    const selectedAbsenceId = selectedEvent.extendedProps.id;
    const selectedAbsence = this.absences.find(absence => absence.id === selectedAbsenceId) || null;

    if (this.isSelectionMode && selectedAbsence) {
      if (this.selectedAbsences.includes(selectedAbsence)) {
        this.selectedAbsences = this.selectedAbsences.filter(absence => absence.id !== selectedAbsence.id);
      } else {
        this.selectedAbsences.push(selectedAbsence);
      }
      console.log('Selected absences:', this.selectedAbsences);
      // Do not show alert in selection mode
    } else if (selectedAbsence) {
      this.selectedAbsence = selectedAbsence;
      Swal.fire({
        title: 'Absence sélectionnée',
        text: `Statut: ${this.selectedAbsence.statutAbsence}`,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  }

  toggleSelectionMode(): void {
    this.isSelectionMode = !this.isSelectionMode;
    if (!this.isSelectionMode) {
      this.selectedAbsences = []; // Clear selections when exiting selection mode
    }
    console.log('Selection mode:', this.isSelectionMode);
  }

  processSelectedAbsences(): void {
    if (this.selectedAbsences.length > 0) {
      // Implement further processing logic here, e.g., justifying multiple absences
      Swal.fire({
        title: 'Justification des absences ',
        text: `Vous avez sélectionné ${this.selectedAbsences.length} absences.`,
        icon: 'info',
        showDenyButton: true,
        denyButtonText: 'Annuler',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with justifying the selected absences
          this.selectedAbsences.forEach(absence => this.justifier(absence));
          this.selectedAbsences = [];
          this.isSelectionMode = false;
        } else if (result.isDenied) {
          // Do nothing if "Annuler" is clicked
          console.log('Justification annulée');
        }
      });
    } else {
      Swal.fire({
        title: 'Pas d\'absences sélectionnées !',
        text: 'Veuillez sélectionner des absences',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }


  renderEventContent(eventInfo: any): { html: string } {
    return { html: `<div class="fc-event-title">${eventInfo.event.extendedProps.status}</div>` };
  }

  updateCalendarOptions(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.events], // Ensure the events are updated
      slotMaxTime: `${this.labels.length}:00:00` // Adjust slotMaxTime based on current labels
    };
    console.log('Calendar options updated:', this.calendarOptions);
  }

  loadAbsences(): void {
    this.absenceService.findAll().subscribe(data => {
      this.absences = data;
      this.updateEvents();
    });
  }

  updateEvents(): void {
    this.events = this.absences.map(absence => {
      const employeIndex = this.allEmployess.findIndex(emp => emp.id === absence.employe.id);
      const startTime = new Date(absence.dateAbsence);
      const endTime = new Date(absence.dateAbsence);

      // Set the start and end time to the specific hour for the employee
      startTime.setHours(employeIndex, 0, 0);
      endTime.setHours(employeIndex + 1, 0, 0);

      return {
        title: `${absence.statutAbsence.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée'}`,
        start: startTime,
        end: endTime,
        color: absence.statutAbsence.toString() === "Justifiée" ? 'green' : 'red',
        extendedProps: {
          id: absence.id, // Add ID to extended properties
          status: absence.statutAbsence.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée'
        }
      };
    });
    console.log('Events updated:', this.events);
    this.updateCalendarOptions();
  }

  updateEventsByDepartement(): void {
    const employeIds = this.employesParDepartement.map(emp => emp.id);
    const filteredAbsences = this.absences.filter(absence => employeIds.includes(absence.employe.id));
    this.events = filteredAbsences.map(absence => {
      const employeIndex = this.employesParDepartement.findIndex(emp => emp.id === absence.employe.id);
      const startTime = new Date(absence.dateAbsence);
      const endTime = new Date(absence.dateAbsence);

      // Set the start and end time to the specific hour for the employee
      startTime.setHours(employeIndex, 0, 0);
      endTime.setHours(employeIndex + 1, 0, 0);

      return {
        title: `${absence.statutAbsence.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée'}`,
        start: startTime,
        end: endTime,
        color: absence.statutAbsence.toString() === "Justifiée" ? 'green' : 'red',
        extendedProps: {
          id: absence.id, // Add ID to extended properties
          status: absence.statutAbsence.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée'
        }
      };
    });
    console.log('Filtered events by department:', this.events);
    this.updateCalendarOptions();
  }

  updateAfterJustification(): void {
    if (this.selectedDepartement) {
      this.findByDepartement(this.selectedDepartement);
    } else {
      this.loadAllEmployees();
      this.loadAbsences();
    }
  }
  get absence(): Absence {
    return this.absenceService.absence;
  }

  set absence(value: Absence) {
    this.absenceService.absence = value;
  }

  get absences(): Absence[] {
    return this.absenceService.absences;
  }

  set absences(value: Absence[]) {
    this.absenceService.absences = value;
  }
}
