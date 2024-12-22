import { Component, Input, AfterViewInit, inject, viewChild, output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';

import { DayPilot } from '@daypilot/daypilot-lite-angular';

import { ResponseList } from 'src/app/core/model/response-list';

import { WorkCalendarEventService } from '../event/work-calendar-event.service';
import { WorkCalendarEvent } from '../event/work-calendar-event.model';

import { CalendarDaypilotHeaderComponent } from 'src/app/third-party/daypilot/calendar-daypilot-header.component';
import { CalendarDaypilotComponent, ModeChangedArgs } from 'src/app/third-party/daypilot/calendar-daypilot.component';

export interface NewDateSelectedArgs {
  workCalendarId: number;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-work-calendar-view',
  imports: [
    CommonModule,
    CalendarDaypilotComponent,
    CalendarDaypilotHeaderComponent
  ],
  template: `
    <app-calendar-daypilot-header #header
      [titleStartDate]="calendar.mode() === 'Week' ? calendar.displayStart.toDate() : calendar.selectedDate().toDate()"
      [titleEndDate]="calendar.displayEnd.toDate()"
      (previousButtonClicked)="calendar.navigatePrevious($event)"
      (todayButtonClicked)="calendar.navigateToday($event)"
      (nextButtonClicked)="calendar.navigateNext($event)">
    </app-calendar-daypilot-header>

    <div class="calendar-div">
      <app-calendar-daypilot #calendar
        [mode]="header.selectedMode()"
        [events]="eventData"
        (eventClicked)="eventClicked($event)"
        (rangeChanged)="rangeChanged($event)"
        (datesSelected)="onDateClick($event)"
        (modeChanged)="calendarModeChanged($event)">
      </app-calendar-daypilot>
    </div>
  `,
  styles: [`
    .calendar-div {
      /*max-height: 800px; */
      overflow-y: hidden;
      overflow-x: hidden;
      overflow: auto;
      height: 100%;
    }
`]
})
export class WorkCalendarViewComponent implements AfterViewInit {

  calendar = viewChild.required(CalendarDaypilotComponent);

  @Input() fkWorkCalendar: number = 0;

  itemSelected = output<any>();
  newDateSelected = output<NewDateSelectedArgs>();
  eventDataChanged = output<any>();
  visibleRangeChanged = output<{start: Date, end: Date, date: Date}>();
  modeChanged = output<ModeChangedArgs>();

  from!: string;
  to!: string;
  eventData: any[] = [];
  mode?: ModeChangedArgs;

  private service = inject(WorkCalendarEventService);

  ngAfterViewInit(): void {
    //this.from = this.datePipe.transform(this.calendar.start.toDateLocal(),'yyyyMMdd') ?? '';
    //this.to = this.datePipe.transform(this.calendar.end.toDateLocal(),'yyyyMMdd') ?? '';

    this.from = formatDate(this.calendar().displayStart.toDateLocal(),'YYYYMMdd','ko-kr') ?? '';
    this.to = formatDate(this.calendar().displayEnd.toDateLocal(),'YYYYMMdd','ko-kr') ?? '';
  }

  rangeChanged(e: any): void {
    this.visibleRangeChanged.emit({start: e.start, end: e.end, date: e.date});

    //this.from = this.datePipe.transform(e.start,'yyyyMMdd') ?? '';
    //this.to = this.datePipe.transform(e.end,'yyyyMMdd') ?? '';

    this.from = formatDate(e.start,'YYYYMMdd','ko-kr') ?? '';
    this.to = formatDate(e.end,'YYYYMMdd','ko-kr') ?? '';

    this.getWorkScheduleList();
  }

  getWorkScheduleList(): void {
    const workGroupId: string = this.fkWorkCalendar.toString();

    if (workGroupId === "" || workGroupId === null || workGroupId === undefined) {
      this.eventData = [];
      return;
    }
    const param = {
      fkWorkCalendar : this.fkWorkCalendar,
      fromDate: this.from,
      toDate: this.to
    };

    console.log(param);

    this.service
        .getWorkScheduleList(param)
        .subscribe(
            (model: ResponseList<WorkCalendarEvent>) => {
              let data: any[] = [];

              model.data.forEach(e => data.push({
                id: e.id,
                text: e.text,
                start: new DayPilot.Date(e.start as string),
                end: new DayPilot.Date(e.end as string),
                barColor: e.color
              }));
              this.eventData = data;
              this.eventDataChanged.emit(this.eventData);
            }
        );
  }

  eventClicked(param: any): void {
    this.itemSelected.emit(param.id);
  }

  onDateClick(params: any): void {
    let endDate: Date = params.end;
    //console.log(this.calendar().mode());
    if (this.calendar().mode() === 'Month') {
      // 선택한 날 + 1일 0시로 설정되어 있어서 전날 23시 59분 59초로 강제로 변경
      endDate = new Date(params.end);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      endDate.setMilliseconds(999);
    }
    console.log(endDate);
    const eventArgs: NewDateSelectedArgs = {workCalendarId: this.fkWorkCalendar, start: params.start, end: endDate};
    this.newDateSelected.emit(eventArgs);
  }

  calendarModeChanged(params: ModeChangedArgs): void {
    //this.mode = params;
    //this.modeChanged.emit(this.mode);
  }

  calendarSetDate(date: DayPilot.Date) {
    this.calendar().displayRangeChangedEvent(date);
  }
}
