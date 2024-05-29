import { Component, OnInit } from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Employe } from "../../../../services/models/employe.model";
import { EmployeService } from "../../../../services/services/employe.service";
import { Absence } from "../../../../services/models/absence.model";
import { AbsenceService } from "../../../../services/services/absence.service";
import { debounceTime, distinctUntilChanged, Subject, switchMap } from "rxjs";
import Swal from "sweetalert2";
import { Page } from "../../../../services/models/page.model";
import { Departement } from "../../../../services/models/departement.model";
import {FullCalendarModule} from "@fullcalendar/angular";
import {EventInput} from "@fullcalendar/core";
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
  selector: 'app-absence-secretaire',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    NgIf,
    NgClass
  ],
  templateUrl: './absence-secretaire.component.html',
  styleUrls: ['./absence-secretaire.component.scss']
})
export class AbsenceSecretaireComponent implements OnInit {

  isSelectionMode: boolean = false;
  selectedAbsences: Absence[] = [];

  calendarOptions: any;
  events: EventInput[] = [];

  labels: string[] = [];

  absencesPage: Page<Absence> = new Page<Absence>();

  // @ts-ignore
  authenticatedEmploye: Employe;

  employes: Employe[] = [];
  selectedAbsence: Absence = new Absence();

  private searchTerms = new Subject<string>();

  constructor(private employeService: EmployeService,
              private absenceService: AbsenceService) { }

  ngOnInit(): void {
    const storedEmployee = localStorage.getItem('authenticatedEmploye');
    if (storedEmployee) {
      this.authenticatedEmploye = JSON.parse(storedEmployee);
    }
    this.loadEmployes();
    this.initializeCalendarOptions();
    this.loadAbsences();
    //this.getAbsencesPage(this.authenticatedEmploye.departement, 0, 5);
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.absenceService.searchAbsences(term))
    ).subscribe(absences => {
      this.absencesPage.content = this.sortAbsencesByDateDesc(absences);
    });
  }

  handleEventClick(info: any): void {
    const selectedEvent = info.event;
    const selectedAbsenceId = selectedEvent.extendedProps.id;
    const selectedAbsence = this.absencesSec.find(absence => absence.id === selectedAbsenceId) || null;

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
      // Collect IDs of selected absences
      const selectedAbsenceIds = this.selectedAbsences.map(absence => absence.id);

      // Prompt user for confirmation
      Swal.fire({
        title: 'Suppression des absences',
        text: `Vous avez sélectionné ${this.selectedAbsences.length} absences. Êtes-vous sûr de vouloir les supprimer ?`,
        icon: 'info',
        showDenyButton: true,
        denyButtonText: 'Annuler',
        confirmButtonText: 'Confirmer'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with deletion if confirmed
          selectedAbsenceIds.forEach(absenceId => {
            const selectedAbsence = this.selectedAbsences.find(absence => absence.id === absenceId);
            if (selectedAbsence) {
              this.deleteByDateAndEmploye(selectedAbsence);
              Swal.fire({
                title: 'Absences supprimées',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            }
          });
          // Clear selections and exit selection mode
          this.selectedAbsences = [];
          this.isSelectionMode = false;
        } else if (result.isDenied) {
          // Do nothing if "Annuler" is clicked
          console.log('Suppression annulée');
        }
      });
    } else {
      Swal.fire({
        title: 'Pas d\'absences sélectionnées',
        text: 'Veuillez sélectionner des absences à supprimer.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }


  renderEventContent(eventInfo: any): { html: string } {
    return { html: `<div class="fc-event-title">${eventInfo.event.extendedProps.status}</div>` };
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [timeGridPlugin],
      initialView: 'timeGridWeek',
      weekends: true,
      locale: frLocale,
      allDaySlot: false,
      slotDuration: '01:00:00',
      slotMinTime: '00:00:00',
      aspectRatio: 2,
      height: 'auto',
      events: [],
      slotLabelContent: (arg:any) => {
        const index = arg.date.getUTCHours();
        if (index < this.labels.length) {
          return { html: `<div class="fw-bold p-1 text-center">${this.labels[index]}</div>` };
        }
        return { html: '' };
      },
      eventContent: this.renderEventContent.bind(this),
      eventClick: this.handleEventClick.bind(this)
    };
  }


  slotLabelContent(arg: any): { html: string } {
    if (arg.event && arg.event.extendedProps) {
      const employeeName = arg.event.extendedProps.employeeName;
      return { html: `<div class="fw-bold p-1 text-center">${employeeName}</div>` };
    } else {
      return { html: '' };
    }
  }




  loadAbsences(): void {
    this.absenceService.findByEmployeDepartement(this.authenticatedEmploye.departement).subscribe(data => {
      this.absencesSec=data;
      this.updateEvents();
    });
  }

  mapAbsencesToEvents(absences: Absence[]): EventInput[] {
    return absences.map(absence => {
      const employeeName = `${absence.employe.nom} ${absence.employe.prenom}`;
      return {
        title: absence.statutAbsence.toString() === 'Justifiée' ? 'Justifiée' : 'Non justifiée',
        start: absence.dateAbsence,
        end: absence.dateAbsence,
        color: absence.statutAbsence.toString() === 'Justifiée' ? 'green' : 'red',
        extendedProps: {
          employeeName: employeeName // Ajoute le nom de l'employé aux propriétés étendues
        }
      };
    });
  }


  sortAbsencesByDateDesc(absences: Absence[]): Absence[] {
    return absences.sort((a, b) => {
      const dateA = new Date(a.dateAbsence).getTime();
      const dateB = new Date(b.dateAbsence).getTime();
      return dateB - dateA;
    });
  }

  getPageNumbers(): number[] {
    const totalPages = this.absencesPage.totalPages;
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  getAbsencesPage(departement: Departement, page: number, size: number): void {
    this.absenceService.getAbsences(departement, page, size).subscribe({
      next: (page) => {
        this.absencesPage = page;
        this.absencesPage.content = this.sortAbsencesByDateDesc(this.absencesPage.content);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des absences paginées:', error);
      }
    });
  }

  private loadEmployes(): void {
    this.employeService.findByDepartement(this.authenticatedEmploye.departement).subscribe({
      next: (employes) => {
        this.employes = employes;
        console.log('Employés chargés:', this.employes);
        this.labels = this.employes.map(emp => `${emp.nom} ${emp.prenom}`);
        this.updateCalendarOptions();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    });
  }

  updateCalendarOptions(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.events], // Ensure the events are updated
      slotMaxTime: `${this.labels.length}:00:00` // Adjust slotMaxTime based on current labels
    };
    console.log('Calendar options updated:', this.calendarOptions);
  }

  public save(absence: Absence): void {
    absence.dateAbsence = new Date().toISOString().split('T')[0];
    this.absenceService.save(absence).subscribe(data => {
      if (data > 0) {
        this.absencesSec.push({ ...this.absenceSec });
        Swal.fire({
          title: 'Absence enregistrée !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.findByEmployeDepartement();
        this.absenceSec = new Absence();
        this.loadAbsences();
      } else {
        Swal.fire({
          title: 'Oops! Une erreur est survenue',
          icon: 'error',
        });
      }
    });
  }

  public deleteByDateAndEmploye(absence:Absence): void {
    this.absenceService.deleteByDateAbsenceAndEmploye(absence.dateAbsence,absence.employe).subscribe(data=>{
      if(data>0){
        console.log("absence supprimée");
        this.loadAbsences();
      }
      else {
        console.log("erreur");
      }
    })
  }

  public findAll(): void {
    this.absenceService.findAll().subscribe(data => {
      this.absencesSec = this.sortAbsencesByDateDesc(data);
    })
  }

  public findByEmployeDepartement(): void {
    this.absenceService.findByEmployeDepartement(this.authenticatedEmploye.departement).subscribe(data => {
      this.absencesSec = this.sortAbsencesByDateDesc(data);
    })
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  get absenceSec(): Absence {
    return this.absenceService.absenceSec;
  }

  set absenceSec(value: Absence) {
    this.absenceService.absenceSec = value;
  }

  get absencesSec(): Absence[] {
    return this.absenceService.absencesSec;
  }

  set absencesSec(value: Absence[]) {
    this.absenceService.absencesSec = value;
  }

  private updateEvents() {
    this.events = this.absencesSec.map(absence => {
      const employeIndex = this.employes.findIndex(emp => emp.id === absence.employe.id);
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
}
