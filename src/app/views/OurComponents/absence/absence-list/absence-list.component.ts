import { Component, OnInit } from '@angular/core';
import { Absence } from '../../../../services/models/absence.model';
import { AbsenceService } from '../../../../services/services/absence.service';
import { NgForOf } from '@angular/common';
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
    FullCalendarModule
  ],
  templateUrl: './absence-list.component.html',
  styleUrls: ['./absence-list.component.scss']
})
export class AbsenceListComponent implements OnInit {

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
  selectedDepartement:Departement=new Departement();
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
    this.selectedDepartement=departement;
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
          return { html: `<div class="m-1">${this.labels[index]}</div>` };
        }
        return { html: '' };
      },
      allDaySlot: false,
      slotDuration: '01:00:00',
      slotMinTime: '00:00:00',
      slotMaxTime: `${this.allEmployess.length}:00:00`, // Adjust max time based on all employees
      events: [], // Initialize with empty events
      aspectRatio: 2, // Augmenter le rapport d'aspect pour augmenter la hauteur
      height:'auto',
      eventContent: this.renderEventContent.bind(this) // Use custom event rendering
    };
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
          status: absence.statutAbsence.toString() === "Justifiée" ? 'Justifiée' : 'Non justifiée'
        }
      };
    });
    console.log('Filtered events by department:', this.events);
    this.updateCalendarOptions();
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
