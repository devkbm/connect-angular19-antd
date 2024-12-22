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

import { RoleService } from './role.service';
import { Role } from './role.model';

@Component({
  selector: 'app-role-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="roleList"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridSize)="test($event)"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `,
  styles: [`
    /* 헤더 텍스트를 중앙으로 변경 - ::ng-deep대신 다른 방법이 있는지 확인 필요 */
    :host::ng-deep .header-center .ag-cell-label-container { flex-direction: row; justify-content: center; }
    :host::ng-deep .header-center .ag-header-cell-label { flex-direction: row; justify-content: center; }

    /* 헤더 텍스트를 우측으로 변경 - ::ng-deep대신 다른 방법이 있는지 확인 필요 */
    :host::ng-deep .header-right .ag-cell-label-container { flex-direction: row; }
    :host::ng-deep .header-right .ag-header-cell-label { flex-direction: row-reverse; }
  `]
})
export class RoleGridComponent implements OnInit {

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

  roleList: Role[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  private service = inject(RoleService);
  private appAlarmService = inject(AppAlarmService);

  defaultColDef: ColDef = { sortable: true, resizable: true };

  columnDefs : ColDef[] = [
    {
      headerName: '',
      sortable: true,
      resizable: true,
      width: 40,
      suppressSizeToFit: true,
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
      headerClass: 'header-right',
      valueGetter: 'node.rowIndex + 1',
      suppressSizeToFit: true,
      width: 70,
      cellStyle: {'text-align': 'center'}
    },
    {
      headerName: '롤코드',
      headerClass: 'header-center',
      field: 'roleCode',
      suppressSizeToFit: true,
      width: 100
    },
    {
      headerName: '롤명',
      headerClass: 'header-center',
      field: 'roleName',
      suppressSizeToFit: true,
      width: 100
    },
    {
      headerName: '설명',
      field: 'description'
    },
    {
      headerName: '메뉴그룹코드',
      headerClass: 'header-center',
      field: 'menuGroupCode',
      suppressSizeToFit: true,
      width: 100
    }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.roleCode;
  };

  ngOnInit() {
    this.getList();
  }

  getList(params?: any): void {
    this.service
        .getRoleList(params)
        .subscribe(
          (model: ResponseList<Role>) => {
            this.roleList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  rowClickedEvent(params: any): void {
    this.rowClicked.emit(params.data);
  }

  rowDbClicked(params: any): void {
    this.rowDoubleClicked.emit(params.data);
  }

  private onEditButtonClick(e: any) {
    this.editButtonClicked.emit(e.rowData);
  }

  public test(event: any): void {
    console.log(event);
  }

}
