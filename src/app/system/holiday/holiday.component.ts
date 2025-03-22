import { AfterViewInit, Component, inject, viewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ShapeComponent } from "src/app/core/app/shape.component";
import { NotifyService } from 'src/app/core/service/notify.service';

import { HolidayFormDrawerComponent } from './holiday-form-drawer.component';
import { HolidayGridComponent } from './holiday-grid.component';
import { Holiday } from './holiday.model';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';
import { CalendarDaypilotNavigatorComponent } from 'src/app/third-party/daypilot/calendar-daypilot-navigator.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CalendarFullcalendarComponent } from "../../third-party/fullcalendar/calendar-fullcalendar/calendar-fullcalendar.component";
import { DateSelectArg } from '@fullcalendar/core/index.js';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

@Component({
  selector: 'app-holiday',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzTabsModule,
    NzDatePickerModule,
    NzDividerModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    HolidayGridComponent,
    HolidayFormDrawerComponent,
    CalendarDaypilotNavigatorComponent,
    ShapeComponent,
    CalendarFullcalendarComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="공휴일 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="1" style="text-align: left;">
        <nz-date-picker nzMode="year" [(ngModel)]="query.holiday.year" nzAllowClear="false" (ngModelChange)="getHolidayList()" style="width: 80px;"></nz-date-picker>
      </div>

      <div nz-col [nzSpan]="23" style="text-align: right;">
        <button nz-button (click)="getHolidayList()">
          <span nz-icon nzType="search"></span>조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="newHoliday()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button nzDanger
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="deleteHoliday()" (nzOnCancel)="false">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
      </div>
    </div>
  </app-nz-search-area>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <nz-tabset [(nzSelectedIndex)]="tab.index">
    <nz-tab nzTitle="달력">
    <ng-template nz-tab>
      <div [style]="'height: calc(100vh - 272px)'">
        <app-calendar-fullcalendar
          (dayClicked)="newHoliday2($event)"
        ></app-calendar-fullcalendar>
      </div>
    </ng-template>
    </nz-tab>

    <nz-tab nzTitle="공휴일 등록">
      <ng-template nz-tab>
        <h3 class="grid-title">공휴일 목록</h3>
        <div class="grid-wrapper" >
          <app-holiday-grid
            (rowClicked)="holidayGridRowClicked($event)"
            (editButtonClicked)="edit($event)"
            (rowDoubleClicked)="edit($event)">
          </app-holiday-grid>


          <app-calendar-daypilot-navigator
            [events]="grid().filteredList()"
            (selectChanged)="navigatorSelectChanged($event)">
          </app-calendar-daypilot-navigator>
        </div>
      </ng-template>
    </nz-tab>
  </nz-tabset>
</app-shape>

<app-holiday-form-drawer
  [drawer]="drawer.holiday"
  (drawerClosed)="getHolidayList()">
</app-holiday-form-drawer>

  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.grid-title {
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.grid-wrapper {
  height: calc(100vh - 306px);
  display: grid;
  grid-template-columns: 1fr 200px;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

  `
})
export class HolidayComponent implements AfterViewInit {

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  grid = viewChild.required(HolidayGridComponent);
  calendar = viewChild.required(CalendarFullcalendarComponent);

  query: {
    holiday : { key: string, value: string, list: {label: string, value: string}[], year: Date },
  } = {
    holiday : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '휴일명', value: 'resourceCode'},
        {label: '비고', value: 'description'}
      ],
      year: new Date()
    }
  }

  drawer: {
    holiday: { visible: boolean, formInitId: any }
  } = {
    holiday: { visible: false, formInitId: null }
  }

  tab: {
    index: number
  } = {
    index : 0
  }

  ngAfterViewInit(): void {
    this.getHolidayList();
  }

  openDrawer(): void {
    this.drawer.holiday.visible = true;
  }

  closeDrawer(): void {
    this.drawer.holiday.visible = false;
  }

  getHolidayList(): void {

    this.closeDrawer();


    let params: any = new Object();
    if ( this.query.holiday.value !== '') {
      params[this.query.holiday.key] = this.query.holiday.value;
    }

    const date: Date = this.query.holiday.year;

    if ( this.tab.index == 0 ) {
      this.calendar().getHolidayList(date.getFullYear()+'0101', date.getFullYear()+'1231');
    } else {
      this.grid().gridQuery.set({fromDate: date.getFullYear()+'0101', toDate: date.getFullYear()+'1231'});
    }

  }

  newHoliday2(selectInfo: DateSelectArg) {
    console.log(selectInfo);

    this.drawer.holiday.formInitId = selectInfo.startStr;
    this.openDrawer();
  }

  newHoliday(): void {
    this.drawer.holiday.formInitId = null;
    this.openDrawer();
  }

  deleteHoliday(): void {
    const date = this.grid().getSelectedRows()[0].date;
    this.delete(date);
  }

  delete(date: Date): void {
    const id = formatDate(date, 'yyyyMMdd','ko-kr') as string;
    if (id === null) return;

    const url = GlobalProperty.serverUrl + `/holiday/${id}`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    }

    this.http
        .delete<ResponseObject<Holiday>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Holiday>>('deleteHoliday', undefined))
        )
        .subscribe(
          (model: ResponseObject<Holiday>) => {
            this.notifyService.changeMessage(model.message);
            this.getHolidayList();
          }
        );
  }

  holidayGridRowClicked(item: any): void {
    this.drawer.holiday.formInitId = item.date;
  }

  edit(item: any): void {
    this.drawer.holiday.formInitId = item.date;
    this.openDrawer();
  }

  navigatorSelectChanged(params: any) {
    //console.log(params);
    //console.log(params.start.value as Date);
    this.drawer.holiday.formInitId = params.start.value as Date;
    this.openDrawer();
  }
}
