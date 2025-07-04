import { Component, viewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkCalendarEventFormDrawerComponent } from './event/work-calendar-event-form-drawer.component';
import { WorkCalendarFormDrawerComponent } from './calendar/work-calendar-form-drawer.component';
import { NewDateSelectedArgs, WorkCalendarViewComponent } from './calendar-view/work-calendar-view.component';
import { NewFormValue, WorkCalendarEventFormComponent } from './event/work-calendar-event-form.component';
import { WorkCalendarFormComponent } from './calendar/work-calendar-form.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { CalendarDaypilotNavigatorComponent } from 'src/app/third-party/daypilot/calendar-daypilot-navigator.component';
import { ModeChangedArgs } from 'src/app/third-party/daypilot/calendar-daypilot.component';
import { MyWorkCalendarListComponent } from "./calendar/my-work-calendar-list.component";

@Component({
  selector: 'work-calendar-app',
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    WorkCalendarViewComponent,
    CalendarDaypilotNavigatorComponent,
    WorkCalendarEventFormDrawerComponent,
    WorkCalendarFormDrawerComponent,
    MyWorkCalendarListComponent
],
  template: `
    <button nz-button (click)="getMyWorkGroupList()">
      <span nz-icon nzType="search" nzTheme="outline"></span>조회
    </button>

    <button nz-button (click)="newWorkGroup()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규 CALENDAR
    </button>

    <!--
    <button nz-button (click)="newSchedule()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규 일정
    </button>
    -->

    <div class="grid-wrapper">
      @defer {
      <app-calendar-daypilot-navigator class="navi"
        [events]="this.eventData"
        (selectChanged)="navigatorSelectChanged($event)">
      </app-calendar-daypilot-navigator>
      }
      <app-my-work-calendar-list
        (rowClicked)="workGroupSelect($event)"
        (rowDoubleClicked)="modifyWorkGroup($event)">
      </app-my-work-calendar-list>


      @defer {
      <app-work-calendar-view class="calendar"
        [fkWorkCalendar]="drawer.workGroup.formDataId"
        (itemSelected)="editSchedule($event)"
        (newDateSelected)="newScheduleByDateSelect($event)"
        (eventDataChanged)="eventDateChanged($event)"
        (visibleRangeChanged)="calendarVisibleRangeChanged($event)"
        (modeChanged)="modeChanged($event)">
      </app-work-calendar-view>
      }
    </div>

    <app-work-calendar-event-form-drawer
      [drawer]="drawer.schedule"
      [newFormValue]="this.newScheduleArgs"
      (drawerClosed)="getScheduleList()">
    </app-work-calendar-event-form-drawer>

    <app-work-calendar-form-drawer
      [drawer]="drawer.workGroup"
      (drawerClosed)="getMyWorkGroupList()">
    </app-work-calendar-form-drawer>
  `,
  styles: `
    .grid-wrapper {
      height: calc(100% - 32px);
      //height: 100%;
      display: grid;
      gap: 5px;
      grid-template-rows: 220px 1fr;
      grid-template-columns: 200px 1fr;
      grid-template-areas:
        "navi calendar"
        "title calendar";
    }

    .navi {
      grid-area: navi;
      padding-top: 10px
    }
    .title {
      grid-area: title;
    }
    .calendar {
      grid-area: calendar;
    }
  `
})
export class WorkCalendarApp implements AfterViewInit {

  myWorkGroupList = viewChild.required(MyWorkCalendarListComponent);
  workGroupForm = viewChild.required(WorkCalendarFormComponent);

  navigator = viewChild.required(CalendarDaypilotNavigatorComponent);
  workCalendar = viewChild.required(WorkCalendarViewComponent);
  workEventForm = viewChild.required(WorkCalendarEventFormComponent);

  mode: "Day" | "Week" | "Month" | "None" = 'Month';

  newScheduleArgs?: NewFormValue;
  eventData: any[] = [];

  drawer: {
    workGroup: { visible: boolean, formDataId: string },
    schedule: { visible: boolean, formDataId: string }
  } = {
    workGroup: { visible: false, formDataId: '-1' },
    schedule: { visible: false, formDataId: '-1' }
  }

  ngAfterViewInit(): void {
    this.getMyWorkGroupList();
  }

  getMyWorkGroupList(): void {
    this.closeWorkGroupDrawer();
    this.myWorkGroupList().getMyWorkGroupList();
  }

  getScheduleList(): void {
    this.closeWorkGroupDrawer();
    this.closeScheduleDrawer();

    this.workCalendar().fkWorkCalendar = this.drawer.workGroup.formDataId;
    this.workCalendar().getWorkScheduleList();
  }

  openScheduleDrawer() {
    this.drawer.schedule.visible = true;
  }

  closeScheduleDrawer() {
    this.drawer.schedule.visible = false;

    this.workCalendar().fkWorkCalendar = this.drawer.workGroup.formDataId;
    this.workCalendar().getWorkScheduleList();
  }

  openWorkGroupDrawer() {
    this.drawer.workGroup.visible = true;
  }

  closeWorkGroupDrawer() {
    this.drawer.workGroup.visible = false;
  }

  newWorkGroup(): void {
    this.drawer.workGroup.formDataId = '';
    this.openWorkGroupDrawer();
  }

  modifyWorkGroup(workGroup: any): void {
    this.drawer.workGroup.formDataId = workGroup;
    this.openWorkGroupDrawer();
  }

  newSchedule(): void {
    this.openScheduleDrawer();

    const today: Date = new Date();
    const from: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), 0);
    const to: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + 1, 0);
    this.newScheduleArgs = {workCalendarId: this.drawer.workGroup.formDataId, start: from, end: to, allDay: true};

    this.drawer.schedule.formDataId = '';
  }

  newScheduleByDateSelect(param: NewDateSelectedArgs) {
    if (param.workCalendarId === '') {
      alert('CALENDAR를 선택해주세요.');
      return;
    }

    //this.navigator().date = new DayPilot.Date(param.start, true);

    // daypilot 날짜 선택시 종료일 + 1일로 설정되어서 강제로 전일자로 수정
    //const to: Date = param.end;
    //to.setDate(to.getDate() -1);

    this.newScheduleArgs = {workCalendarId: this.drawer.workGroup.formDataId, start: param.start, end: param.end, allDay: param.allDay};
    this.drawer.schedule.formDataId = '';

    this.openScheduleDrawer();
  }

  editSchedule(id: any) {
    this.drawer.schedule.formDataId = id;
    this.newScheduleArgs = undefined;

    this.openScheduleDrawer();
  }

  workGroupSelect(ids: any): void {
    this.drawer.workGroup.formDataId = ids;
    this.getScheduleList();
  }

  eventDateChanged(event: any) {
    this.eventData = event;
  }

  calendarVisibleRangeChanged(params: any) {
    /*
    if (this.mode === 'Month') {
      this.navigator.date = new DayPilot.Date(params.date, true);
    } else {
      this.navigator.date = new DayPilot.Date(params.start, true);
    }
    */
  }

  modeChanged(params: ModeChangedArgs): void {
    this.mode = params.mode;
  }

  navigatorSelectChanged(params: any) {
    //this.workCalendar().calendarSetDate(new DayPilot.Date(params.start, true));
  }

}
