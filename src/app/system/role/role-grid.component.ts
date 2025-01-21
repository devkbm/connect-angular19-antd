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

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { RoleService } from './role.service';
import { Role } from './role.model';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

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
export class RoleGridComponent extends AgGridCommon implements OnInit {

  private service = inject(RoleService);
  private appAlarmService = inject(AppAlarmService);
  private http = inject(HttpClient);

  rowClicked = output<Role>();
  rowDoubleClicked = output<Role>();
  editButtonClicked = output<Role>();

  roleList: Role[] = [];

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

  getRowId: GetRowIdFunc<Role> = (params: GetRowIdParams<Role>) => {
    return params.data.roleCode!;
  };

  ngOnInit() {
    this.getList();
  }

  getList(params?: any): void {
    /*
    this.service
        .getRoleList(params)
        .subscribe(
          (model: ResponseList<Role>) => {
            this.roleList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
    */

    const url = GlobalProperty.serverUrl + `/api/system/role`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    this.http
      .get<ResponseList<Role>>(url, options)
      .pipe(
        //catchError(this.handleError<ResponseList<Role>>('getRoleList', undefined))
      )
      .subscribe(
        (model: ResponseList<Role>) => {
          this.roleList = model.data;
          this.appAlarmService.changeMessage(model.message);
        }
      );
  }

  rowClickedEvent(params: RowClickedEvent<Role>): void {
    this.rowClicked.emit(params.data!);
  }

  rowDbClicked(params: RowDoubleClickedEvent<Role>): void {
    this.rowDoubleClicked.emit(params.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
