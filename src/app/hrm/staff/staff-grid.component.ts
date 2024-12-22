import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { StaffService } from './staff.service';
import { Staff } from './staff.model';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';

@Component({
  selector: 'app-staff-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="list"
      [style.height]="'100%'"
      [defaultColDef]="defaultColDef"
      [columnDefs]="columnDefs"
      [getRowId]="getRowId"
      [rowSelection]="rowSelection"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDbClickedFunc($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class StaffGridComponent extends AgGridCommon implements OnInit {

  private service = inject(StaffService);
  private appAlarmService = inject(AppAlarmService);

  list: Staff[] = [];

  rowClicked = output<Staff>();
  rowDoubleClicked = output<Staff>();
  editButtonClicked = output<Staff>();

  columnDefs: ColDef[] = [
    /*{
      headerName: '',
      width: 34,
      cellStyle: {'text-align': 'center', padding: '0px'},
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      }
    },*/
    {
      headerName: '',
      valueGetter: 'node.rowIndex + 1',
      width: 38,
      cellStyle: {'text-align': 'center'}
    },
    {headerName: '직원번호',      field: 'staffNo',         width: 77},
    {headerName: '직원명',        field: 'name',            width: 75 }
    /*{headerName: '생년월일',      field: 'birthday',        width: 200 } */
  ];

  getRowId: GetRowIdFunc<Staff> = (params: GetRowIdParams<Staff>) => {
    return params.data.companyCode! + params.data.staffNo!;
  };

  ngOnInit() {
    this.getList();
  }

  getList(params?: any): void {
    this.service
        .getStaffList(params)
        .subscribe(
          (model: ResponseList<Staff>) => {
            this.list = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  rowClickedFunc(event: RowClickedEvent<Staff>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClickedFunc(event: RowDoubleClickedEvent<Staff>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
