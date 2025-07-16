import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CalendarComponent } from "@schedule-x/angular";
import { createCalendar, createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/index.css' // can alternatively be added in your angular.json

@Component({
  selector: 'app-x-calendar',
  imports: [
    CalendarComponent
  ],
  template: `
    <sx-calendar [calendarApp]="calendarApp">
    </sx-calendar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XCalendarComponent {

    calendarApp = createCalendar({
    locale: 'ko-KR',
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2025-07-11 03:00',
        end: '2025-07-11 05:00',
      },
    ],
    views: [createViewMonthGrid(), createViewWeek()],
  })

}
