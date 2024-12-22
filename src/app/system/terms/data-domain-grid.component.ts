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

import { DataDomainService } from './data-domain.service';
import { DataDomain } from './data-domain.model';

@Component({
  selector: 'app-data-domain-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
  <ag-grid-angular
    [theme]="theme"
    [rowData]="list"
    [style.height]="'100%'"
    [rowSelection]="rowSelection"
    [columnDefs]="columnDefs"
    [getRowId]="getRowId"
    [defaultColDef]="defaultColDef"
    (gridReady)="onGridReady($event)"
    (rowClicked)="rowClickedFunc($event)"
    (rowDoubleClicked)="rowDbClickedFunc($event)">
  </ag-grid-angular>
  `,
  styles: []
})
export class DataDomainGridComponent implements OnInit {

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

  list: DataDomain[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private service = inject(DataDomainService);
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
    /*{headerName: '도메인ID',      field: 'domainId',      width: 100 },*/
    {headerName: '데이터베이스',  field: 'database',      width: 100 },
    {headerName: '도메인',        field: 'domainName',    width: 100 },
    {headerName: '데이터타입',    field: 'dataType',      width: 150 },
    {headerName: '비고',          field: 'comment',       width: 400 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.domainId;
  };

  ngOnInit() {
    this.getList();
  }

  getList(params?: any) {
    this.service
        .getList()
        .subscribe(
          (model: ResponseList<DataDomain>) => {
            if (model.data) {
              this.list = model.data;
            } else {
              this.list = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  rowClickedFunc(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClickedFunc(event: any) {
    this.rowDoubleClicked.emit(event.data);
  }

}
