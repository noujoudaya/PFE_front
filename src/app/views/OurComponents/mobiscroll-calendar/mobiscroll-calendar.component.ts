import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import {
  MbscCalendarEvent,
  MbscEventcalendarOptions,
  Notifications,
  setOptions,
  localeFr,
  MbscEventcalendarModule
} from '@mobiscroll/angular';

setOptions({
  locale: localeFr,
  theme: 'ios',
  themeVariant: 'light',
});

@Component({
  selector: 'app-mobiscroll-calendar',
  standalone: true,
  imports: [
    MbscEventcalendarModule
  ],
  templateUrl: './mobiscroll-calendar.component.html',
  styleUrl: './mobiscroll-calendar.component.scss',
  providers: [Notifications],
})
export class MobiscrollCalendarComponent implements OnInit{

  constructor(
    private http: HttpClient,
    private notify: Notifications,
  ) {}

  myEvents: MbscCalendarEvent[] = [];

  eventSettings: MbscEventcalendarOptions = {
    locale: localeFr,
    theme: 'windows',
    themeVariant: 'light',
    clickToCreate: true,
    dragToCreate: true,
    dragToMove: true,
    dragToResize: true,
    eventDelete: true,
    view: {
      calendar: {
        popover: true,
        count: true,
      },
    },
    onEventClick: (args) => {
      this.notify.toast({
        message: args.event.title,
      });
    },
  };

  ngOnInit(): void {
    this.http.jsonp<MbscCalendarEvent[]>('https://trial.mobiscroll.com/events/?vers=5', 'callback').subscribe((resp) => {
      this.myEvents = resp;
    });
  }
}
