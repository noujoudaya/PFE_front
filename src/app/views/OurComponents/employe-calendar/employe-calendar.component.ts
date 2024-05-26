import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from "@fullcalendar/angular";
import { EventInput } from "@fullcalendar/core";
import frLocale from '@fullcalendar/core/locales/fr';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-employe-calendar',
  standalone: true,
  imports: [
    FullCalendarModule
  ],
  templateUrl: './employe-calendar.component.html',
  styleUrl: './employe-calendar.component.scss'
})
export class EmployeCalendarComponent implements OnInit {

  calendarOptions: any;
  // @ts-ignore
  events: EventInput[];

  ngOnInit(): void {

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin,timeGridPlugin],
      initialView: 'dayGridMonth',
      //selectable:true,
      //unselectedAuto:true,
      weekends: true,
      locale: frLocale,
      events: this.events
    };
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends;
  }

}
