import { Component, OnInit, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

import { Company } from './company.model';

@Component({
  selector: 'app-company-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridResource.value()?.data"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDoubleClickedFunc($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class CompanyGridComponent extends AgGridCommon {

  private http = inject(HttpClient);

  rowClicked = output<Company>();
  rowDoubleClicked = output<Company>();
  editButtonClicked = output<Company>();

  _data: Company[] = [];

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px', 'margin': '0px'},
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
    { headerName: '회사코드',       field: 'companyCode',                 width: 80 },
    { headerName: '회사명',         field: 'companyName',                 width: 100 },
    { headerName: '사업자등록번호',  field: 'businessRegistrationNumber',  width: 120 },
    { headerName: '법인번호',       field: 'coporationNumber',            width: 100 },
    { headerName: '대표자',         field: 'nameOfRepresentative',        width: 100 },
    { headerName: '설립일',         field: 'establishmentDate',           width: 100 }
  ];

  getRowId: GetRowIdFunc<Company> = (params: GetRowIdParams<Company>) => {
    return params.data.companyCode!;
  };

  gridQuery = signal<any>('');
  gridResource = rxResource({
    request: () => this.gridQuery(),
    loader: ({request}) => this.http.get<ResponseList<Company>>(
      GlobalProperty.serverUrl + `/api/system/company`, {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: request
    })
  })

  rowClickedFunc(event: RowClickedEvent<Company>) {
    this.rowClicked.emit(event.data!);
  }

  rowDoubleClickedFunc(event: RowDoubleClickedEvent<Company>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}

