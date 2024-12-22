import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { themeBalham, GetRowIdFunc, GetRowIdParams, RowSelectionOptions, colorSchemeDark } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffAppointmentRecordService } from './staff-appointment-record.service';
import { StaffAppointmentRecord } from './staff-appointment-record.model';


@Component({
  selector: 'app-staff-appointment-record-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="_list"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `
})
export class StaffAppointmentRecordGridComponent implements OnInit, OnChanges {

  //#region Ag-grid Api
  public theme = themeBalham.withPart(colorSchemeDark);
  gridApi: any;
  gridColumnApi: any;

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getSelectedRows() {
    return this.gridApi.getSelectedRows();
  }
  //#endregion

  _list: StaffAppointmentRecord[] = [];

  @Input() staffNo?: string;

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private appAlarmService = inject(AppAlarmService);
  private service = inject(StaffAppointmentRecordService);

  defaultColDef: ColDef = { sortable: true, resizable: true };

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px'},
      cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      }
    },
    {
      headerName: 'No',
      valueGetter: 'node.rowIndex + 1',
      width: 70,
      cellStyle: {'text-align': 'center'}
    },
    { headerName: '발령분류',       field: 'appointmentTypeName',     width: 90 },
    { headerName: '발령일',         field: 'appointmentDate',         width: 90 },
    { headerName: '발령종료일',     field: 'appointmentEndDate',      width: 90 },
    { headerName: '발령기록',       field: 'recordName',              width: 200 },
    { headerName: '소속부서',       field: 'blngDeptName',            width: 100 },
    { headerName: '근무부서',       field: 'workDeptName',            width: 100 },
    { headerName: '직군',           field: 'jobGroupName',            width: 80 },
    { headerName: '직위',           field: 'jobPositionName',         width: 80 },
    { headerName: '직종',           field: 'occupationName',          width: 80 },
    { headerName: '직급',           field: 'jobGradeName',            width: 80 },
    { headerName: '호봉',           field: 'payStepName',             width: 80 },
    { headerName: '직무',           field: 'jobName',                 width: 80 },
    { headerName: '직책',           field: 'dutyResponsibilityName',  width: 80 },
    { headerName: '비고',           field: 'comment',                 width: 80 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.seq;
  };

  ngOnInit() {
    //this.setWidthAndHeight('100%', '600px');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staffNo']) {
      this.getList(changes['staffNo'].currentValue);
    }
  }

  getList(staffNo: string): void {
    this.service
        .getList(staffNo)
        .subscribe(
          (model: ResponseList<StaffAppointmentRecord>) => {
            this._list = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

  onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }
}
