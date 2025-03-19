import { Component, OnInit, inject, output } from '@angular/core';
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

import { CommonCodeService } from './common-code.service';
import { CommonCode } from './common-code.model';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';


@Component({
  selector: 'app-common-code-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="commonCodeList"
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
export class CommonCodeGridComponent extends AgGridCommon implements OnInit {

  private commonCodeService = inject(CommonCodeService);
  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  commonCodeList: CommonCode[] = [];

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

  ngOnInit(): void {
    this.getCommonCodeList();
  }

  getCommonCodeList(params?: any): void {
    /*
    this.commonCodeService
        .getCodeList(params)
        .subscribe(
          (model: ResponseList<CommonCode>) => {
            this.commonCodeList = model.data;
            this.notifyService.changeMessage(model.message);
          }
        );
    */

    const url = GlobalProperty.serverUrl + `/api/system/code`;
    const options = {
        headers: getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
      };

    this.http.get<ResponseList<CommonCode>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseList<CommonCode>) => {
        this.commonCodeList = model.data;
        this.notifyService.changeMessage(model.message);
      }
    );
  }

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
