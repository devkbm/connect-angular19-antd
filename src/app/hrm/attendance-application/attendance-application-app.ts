import { Component, OnInit, AfterViewInit, viewChild, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { ShapeComponent } from "src/app/core/app/shape.component";
import { SessionManager } from 'src/app/core/session-manager';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { CalendarFullcalendarComponent } from "src/app/third-party/fullcalendar/calendar-fullcalendar/calendar-fullcalendar.component";

import { ResponseList } from 'src/app/core/model/response-list';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core/index.js';

import { AttendanceApplicationFormComponent } from './attendance-application-form.component';
import { AttendanceApplicationGridComponent } from './attendance-application-grid.component';
import { AttendanceApplicationGrid } from './attendance-application-grid.model';

@Component({
  selector: 'duty-application-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzGridModule,
    NzButtonModule,
    NzTabsModule,
    NzPageHeaderCustomComponent,
    AttendanceApplicationGridComponent,
    AttendanceApplicationFormComponent,
    ShapeComponent,
    CalendarFullcalendarComponent
],
  template: `

<ng-template #header>
  <nz-page-header-custom title="근태신청 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <div nz-row class="btn-group">
    <div nz-col [nzSpan]="24" style="text-align: right;">
      {{staffNo}}
      <button nz-button (click)="getList()">
          <span nz-icon nzType="search" nzTheme="outline"></span>조회
        </button>
    </div>
  </div>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="grid-wrapper">

  <nz-tabset [(nzSelectedIndex)]="tab.index">
    <nz-tab nzTitle="달력">
      <div style="height: calc(100vh - 272px)">
        <app-calendar-fullcalendar
          (dayClicked)="dayClicked($event)"
          (eventClicked)="itemClicked($event)"
        >

        </app-calendar-fullcalendar>
      </div>
    </nz-tab>
    <nz-tab nzTitle="리스트">
      <div style="height: calc(100vh - 272px)">
        <app-attendance-application-grid (rowClicked)="gridRowClicked($event)">
        </app-attendance-application-grid>
      </div>
    </nz-tab>
  </nz-tabset>

    <app-attendance-application-form
      (formClosed)="getList()"
      (formDeleted)="getList()"
      (formSaved)="getList()"
    >
    </app-attendance-application-form>
  </div>
</app-shape>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.grid-wrapper {
  height: calc(100% - 5px);
  display: grid;
  grid-template-columns: 1fr 0.7fr;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

  `
})
export class AttendanceApplicationApp implements OnInit, AfterViewInit {

  private http = inject(HttpClient);

  grid = viewChild.required(AttendanceApplicationGridComponent);
  form = viewChild.required(AttendanceApplicationFormComponent);

  calendar = viewChild.required(CalendarFullcalendarComponent);

  staffNo = SessionManager.getStaffNo();

  _data: AttendanceApplicationGrid[] = [];

  tab: {
    index: number
  } = {
    index : 0
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  getList() {
    this.grid().getGridList("TEST");
    this.getGridList("TEST");
  }

  gridRowClicked(row: AttendanceApplicationGrid) {
    console.log(row);
    this.form().get(row.id!);
  }

  getGridList(staffNo: string): void {
    const params = {
      staffId : staffNo
    };

    const url = GlobalProperty.serverUrl + `/api/hrm/dutyapplication`;
    const options = getHttpOptions(params);

    this.http.get<ResponseList<AttendanceApplicationGrid>>(url, options).pipe(
      //catchError(this.handleError<ResponseList<DutyApplicationGrid>>('getDutyApplicationList', undefined))
    ).subscribe(
      (model: ResponseList<AttendanceApplicationGrid>) => {
        //model.data ? this._data = model.data : this._data = [];
        this._data = model.data ? model.data : [];

        let data: any[] = [];

        model.data.forEach(e => data.push({
          id: e.id,
          title: e.dutyName,
          start: e.fromDate as string,
          end: e.toDate as string,
          //barColor: e.color
        }));

        this.calendar().setEvents(data);
      }
    )
  }

  dayClicked(item: DateSelectArg) {
    //console.log(item);
    let toDate = item.end;
    toDate.setDate(toDate.getDate() -1);
    this.form().newForm(item.startStr, formatDate(toDate,'YYYY-MM-dd','ko-kr'));
  }

  itemClicked(item: EventClickArg) {
    //console.log(item.event);
    const id = item.event.id;
    this.form().get(id);
  }

}
