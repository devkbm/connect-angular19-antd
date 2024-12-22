import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
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
export class DataDomainGridComponent extends AgGridCommon implements OnInit {

  private service = inject(DataDomainService);
  private appAlarmService = inject(AppAlarmService);

  rowClicked = output<DataDomain>();
  rowDoubleClicked = output<DataDomain>();
  editButtonClicked = output<DataDomain>();

  list: DataDomain[] = [];

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

  getRowId: GetRowIdFunc<DataDomain> = (params: GetRowIdParams<DataDomain>) => {
    return params.data.domainId!;
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

  rowClickedFunc(event: RowClickedEvent<DataDomain>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClickedFunc(event: RowDoubleClickedEvent<DataDomain>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

}
