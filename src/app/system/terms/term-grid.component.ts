import { Component, OnInit, inject, output } from '@angular/core';
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

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { TermService } from './term.service';
import { Term } from './term.model';

@Component({
  selector: 'app-term-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="termList"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [getRowId]="getRowId"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDbClickedFunc($event)">
  </ag-grid-angular>
  `
})
export class TermGridComponent implements OnInit {
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

  termList: Term[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();;

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private termService = inject(TermService);
  private appAlarmService = inject(AppAlarmService);

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', padding: '0px'},
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
    {headerName: '용어ID',      field: 'termId',            width: 200 },
    {headerName: '시스템',      field: 'system',            width: 100 },
    {headerName: '용어',        field: 'term',              width: 200 , tooltipField: 'term'},
    {headerName: '용어(영문)',  field: 'termEng',           width: 150 },
    {headerName: '컬럼명',      field: 'columnName',        width: 200 },
    {headerName: '도메인명',    field: 'dataDomainName',    width: 100 },
    {headerName: '설명',        field: 'description',       width: 400 },
    {headerName: '비고',        field: 'comment',           width: 400 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
      return params.data.termId;
  };

  ngOnInit() {
    this.getList();
  }

  getList(params?: any): void {
    this.termService
        .getTermList(params)
        .subscribe(
          (model: ResponseList<Term>) => {
            if (model.data) {
              this.termList = model.data;
            } else {
              this.termList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  rowClickedFunc(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();
    this.rowClicked.emit(selectedRows[0]);
  }

  onEditButtonClick(event: any) {
    this.editButtonClicked.emit(event.rowData);
  }

  rowDbClickedFunc(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

}
