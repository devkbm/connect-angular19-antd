import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { MenuGroup } from './menu-group.model';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

@Component({
  selector: 'app-menu-group-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="menuGroupList"
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
export class MenuGroupGridComponent extends AgGridCommon implements OnInit {

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  rowClicked = output<MenuGroup>();
  rowDoubleClicked = output<MenuGroup>();
  editButtonClicked = output<MenuGroup>();

  menuGroupList: MenuGroup[] = [];

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
      width: 50,
      cellStyle: {'text-align': 'center'}
    },
    {
      headerName: '메뉴그룹코드',
      field: 'menuGroupCode',
      width: 100,
      cellStyle: {'text-align': 'center'}
    },
    {
      headerName: '메뉴그룹명',
      field: 'menuGroupName',
      width: 120
    },
    {
      headerName: '메뉴그룹URL',
      field: 'menuGroupUrl',
      width: 150
    },
    {
      headerName: '설명',
      field: 'description',
      width: 300,
      headerClass: 'text-center'
    }
  ];

  getRowId: GetRowIdFunc<MenuGroup> = (params: GetRowIdParams<MenuGroup>) => {
    return params.data.menuGroupCode!;
  };

  ngOnInit() {
    this.getMenuGroupList();
  }

  getMenuGroupList(params?: any): void {
    const url = GlobalProperty.serverUrl + `/api/system/menugroup`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    this.http
        .get<ResponseList<MenuGroup>>(url, options)
        .pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            this.menuGroupList = model.data;
            this.notifyService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<MenuGroup>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
