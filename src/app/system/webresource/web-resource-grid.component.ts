import { Component, effect, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { themeBalham, GetRowIdFunc, GetRowIdParams, RowSelectionOptions, colorSchemeDark } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { WebResource } from './web-resource.model';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-web-resource-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <!-- [rowData]="_list" -->
     {{listResource.value()!.data | json }}
    <button (click)="listResource.reload()">reload</button>
    <ag-grid-angular
      [theme]="theme"
      [rowData]="listResource.value()!.data"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `,
  styles: [`

    ag-grid-angular {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `]
})
export class WebResourceGridComponent extends AgGridCommon {

  private appAlarmService = inject(AppAlarmService);
  private http = inject(HttpClient);

  rowClicked = output<WebResource>();
  rowDoubleClicked = output<WebResource>();
  editButtonClicked = output<WebResource>();

  _list: WebResource[] = [];

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
    { headerName: '리소스ID',     field: 'resourceId',      width: 150 },
    { headerName: '리소스명',     field: 'resourceName',    width: 200 },
    { headerName: '리소스타입',   field: 'resourceType',    width: 200 },
    { headerName: 'Url',          field: 'url',             width: 200 },
    { headerName: '설명',         field: 'description',     width: 300 }
  ];

  getRowId: GetRowIdFunc<WebResource> = (params: GetRowIdParams<WebResource>) => {
    return params.data.resourceId!;
  };

  constructor() {
    super();
    this.getList();
    //this.listResource.reload();

    effect(() => {
      console.log(this.listResource.value());
    })
  }

  listResource = rxResource({
    request: () => ({
      resourceId: '11',
      resourceName: ''
    }),
    loader: ({request}) => this.http.get<ResponseList<WebResource>>(
      GlobalProperty.serverUrl + `/api/system/webresource`, {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: {}
    })
  })

  public getList(params?: any): void {
    const url = GlobalProperty.serverUrl + `/api/system/webresource`;
    const options = {
        headers: getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    this.http.get<ResponseList<WebResource>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseList<WebResource>) => {
        this._list = model.data;
        this.appAlarmService.changeMessage(model.message);
      }
    );
  }

  rowClickedEvent(event: RowClickedEvent<WebResource>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClicked(event: RowDoubleClickedEvent<WebResource>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
