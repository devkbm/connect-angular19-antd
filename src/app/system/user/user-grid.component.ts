import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/third-party/ag-grid/renderer/checkbox-renderer.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { UserService } from './user.service';
import { User } from './user.model';



@Component({
  selector: 'app-user-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="userList"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
  </ag-grid-angular>
  `
})
export class UserGridComponent extends AgGridCommon implements OnInit {

  private userService = inject(UserService);
  private appAlarmService = inject(AppAlarmService);

  rowClicked = output<User>();
  rowDoubleClicked = output<User>();
  editButtonClicked = output<User>();

  userList: User[] = [];

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
    { headerName: '아이디',        field: 'userId',    width: 100 },
    { headerName: '이름',          field: 'name',      width: 100 },
    { headerName: '부서',          field: 'deptName',  width: 100 },
    { headerName: '핸드폰번호',    field: 'mobileNum', width: 100 },
    { headerName: '이메일',        field: 'email',     width: 100 },
    {
      headerName: '사용여부',
      field: 'enabled',
      width: 80,
      cellStyle: {'text-align': 'center', padding: '0px'},
      cellRenderer: CheckboxRendererComponent,
      cellRendererParams: {
        label: '',
        disabled: true
      }
    },
    {
      headerName: '계정잠금여부',
      field: 'accountNonLocked',
      width: 120,
      cellStyle: {'text-align': 'center', padding: '0px'},
      cellRenderer: CheckboxRendererComponent,
      cellRendererParams: {
        label: '',
        disabled: true
      }
    },
    {
      headerName: '계정만료여부',
      field: 'accountNonExpired',
      width: 120,
      cellStyle: {'text-align': 'center', padding: '0px'},
      cellRenderer:CheckboxRendererComponent,
      cellRendererParams: {
        label: '',
        disabled: true
      }
    },
    {
      headerName: '비번만료여부',
      field: 'credentialsNonExpired',
      width: 120,
      cellStyle: {'text-align': 'center', padding: '0px'},
      cellRenderer: CheckboxRendererComponent,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        disabled: true
      }
    }
  ];

  getRowId: GetRowIdFunc<User> = (params: GetRowIdParams<User>) => {
    return params.data.userId!;
  };

  ngOnInit() {
    this.getUserList();
  }

  getUserList(params?: any): void {

    this.userService
        .getUserList(params)
        .subscribe(
          (model: ResponseList<User>) => {
            this.userList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  rowClickedEvent(event: RowClickedEvent<User>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClicked(event: RowDoubleClickedEvent<User>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
