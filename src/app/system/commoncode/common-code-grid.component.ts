import { Component, OnInit, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { CommonCode } from './common-code.model';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { rxResource } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-common-code-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridResource.value()?.data ?? []"
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
export class CommonCodeGridComponent extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<CommonCode>();
  rowDoubleClicked = output<CommonCode>();
  editButtonClicked = output<CommonCode>();

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
    { headerName: 'ID',            field: 'id',                    width: 150 },
    { headerName: '공통코드',      field: 'code',                  width: 200 },
    { headerName: '공통코드명',    field: 'codeName',              width: 200 },
    { headerName: '약어',          field: 'codeNameAbbreviation',  width: 200 },
    {
      headerName: '시작일',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'fromDate',
      width: 200
    },
    {
      headerName: '종료일',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'toDate',
      width: 200
    },
    { headerName: 'Url',           field: 'url',                   width: 200 },
    { headerName: '설명',          field: 'cmt',                   width: 300 }
  ];

  getRowId: GetRowIdFunc<CommonCode> = (params: GetRowIdParams<CommonCode>) => {
    return params.data.codeId!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    request: () => this.gridQuery(),
    loader: ({request}) => this.http.get<ResponseList<CommonCode>>(
      GlobalProperty.serverUrl() + `/api/system/code`,
      getHttpOptions(request)
    )
  })

  selectionChanged(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();
    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<CommonCode>): void {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}): void {
    this.editButtonClicked.emit(e.rowData);
  }

}
