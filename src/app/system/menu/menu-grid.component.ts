import { Component, Input, inject, output } from '@angular/core';
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

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { MenuService } from './menu.service';
import { Menu } from './menu.model';


@Component({
  selector: 'app-menu-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="menuList"
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
export class MenuGridComponent extends AgGridCommon {

  private menuService = inject(MenuService);
  private appAlarmService = inject(AppAlarmService);

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  @Input() menuGroupCode: string = '';
  menuList: Menu[] = [];

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
    {headerName: '메뉴그룹코드',  field: 'menuGroupCode',   width: 100 },
    {headerName: '메뉴코드',      field: 'menuCode',        width: 80},
    {headerName: '메뉴명',        field: 'menuName',        width: 130},
    {headerName: '메뉴타입',      field: 'menuType',        width: 100 },
    {headerName: '상위메뉴코드',  field: 'parentMenuCode',  width: 100 },
    {headerName: '순번',          field: 'sequence',        width: 60},
    {headerName: 'APP URL',       field: 'appUrl',          width: 300 }
  ];

  getRowId: GetRowIdFunc<Menu> = (params: GetRowIdParams<Menu>) => {
      return params.data.menuGroupCode! + params.data.menuCode!;
  };

  getMenuList(params?: any) {

    this.menuService
        .getMenuList(params)
        .subscribe(
          (model: ResponseList<Menu>) => {
            this.menuList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<Menu>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }
}
