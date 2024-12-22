
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

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { DutyApplicationService } from './duty-application.service';
import { DutyApplication } from './duty-application.model';

@Component({
  selector: 'app-duty-application-grid',
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
  styles: [`
  `]
})
export class DutyApplicationGridComponent implements OnInit {
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

  _list: DutyApplication[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private appAlarmService = inject(AppAlarmService);
  private dutyApplicationService = inject(DutyApplicationService);

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
    { headerName: '근태신청ID',         field: 'dutyId',              width: 150 },
    { headerName: '사원번호',           field: 'staffId',             width: 80 },
    { headerName: '근태코드',           field: 'dutyCode',            width: 80 },
    { headerName: '근태사유',           field: 'dutyReason',          width: 80 },
    { headerName: '근태시작일시',       field: 'dutyStartDateTime',   width: 80 },
    { headerName: '근태근태종료일시',   field: 'dutyEndDateTime',     width: 80 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.dutyId;
  };

  ngOnInit() {
    this.getGridList('');
  }

  public getGridList(typeId: string): void {
    const params = {
      dutyCode : typeId
    };

    this.dutyApplicationService
        .getList(params)
        .subscribe(
          (model: ResponseList<DutyApplication>) => {
            if (model.data) {
              this._list = model.data;
            } else {
              this._list = [];
            }
            this.appAlarmService.changeMessage(model?.message);
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

