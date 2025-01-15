import { Component, OnInit, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DutyApplicationFormComponent } from './duty-application-form.component';
import { DutyApplicationGridComponent } from './duty-application-grid.component';
import { DutyDateListComponent } from './duty-date-list.component';


import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ShapeComponent } from "src/app/core/app/shape.component";
import { HolidayGridComponent } from 'src/app/system/holiday/holiday-grid.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SessionManager } from 'src/app/core/session-manager';
import { DutyApplication } from './duty-application.model';
import { DutyApplicationGrid } from './duty-application-grid.model';

@Component({
  selector: 'app-duty-application',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzGridModule,
    NzButtonModule,
    NzCrudButtonGroupComponent,
    NzPageHeaderCustomComponent,
    DutyDateListComponent,
    DutyApplicationGridComponent,
    DutyApplicationFormComponent,
    ShapeComponent
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

    <app-duty-application-grid (rowClicked)="gridRowClicked($event)">
    </app-duty-application-grid>

    <app-duty-application-form>
    </app-duty-application-form>
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
  grid-template-columns: 300px 1fr;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

  `
})
export class DutyApplicationComponent implements OnInit, AfterViewInit {

  grid = viewChild.required(DutyApplicationGridComponent);
  form = viewChild.required(DutyApplicationFormComponent);

  staffNo = SessionManager.getUserId();

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  getList() {
    this.grid().getGridList("TEST");
  }

  gridRowClicked(row: DutyApplicationGrid) {
    console.log(row);
    this.form().get(row.id!);
  }
}
