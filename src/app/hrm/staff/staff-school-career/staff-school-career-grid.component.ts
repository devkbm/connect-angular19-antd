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

import { StaffSchoolCareerService } from './staff-school-career.service';
import { StaffSchoolCareer } from './staff-school-career.model';


@Component({
  selector: 'app-staff-school-career-grid',
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
  `,
  styles: []
})
export class StaffSchoolCareerGridComponent implements OnInit, OnChanges {

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

  protected _list: StaffSchoolCareer[] = [];

  @Input() staffId?: string;

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private appAlarmService = inject(AppAlarmService);
  private service = inject(StaffSchoolCareerService);

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
    { headerName: '학력',           field: 'schoolCareerTypeName',  width: 100 },
    { headerName: '학교',           field: 'schoolCodeName',        width: 150 },
    { headerName: '입학일',         field: 'fromDate',          width: 90 },
    { headerName: '졸업일',         field: 'toDate',            width: 90 },
    { headerName: '전공',           field: 'majorName',         width: 100 },
    { headerName: '부전공',         field: 'pluralMajorName',   width: 100 },
    { headerName: '지역',           field: 'location',          width: 100 },
    { headerName: '수업연한',       field: 'lessonYear',        width: 100 },
    { headerName: '비고',           field: 'comment',           width: 200 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.staffId + params.data.seq;
  };

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staffId'].currentValue) {
      this.getList(changes['staffId'].currentValue);
    }
  }

  getList(staffId: string): void {
    this.service
        .getList(staffId)
        .subscribe(
          (model: ResponseList<StaffSchoolCareer>) => {
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
