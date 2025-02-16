import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { WorkCalendarService } from './work-calendar.service';
import { WorkCalendar } from './work-calendar.model';

@Component({
  selector: 'app-my-work-calendar-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="_data"
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
export class MyWorkCalendarGridComponent extends AgGridCommon implements OnInit {

  private appAlarmService = inject(AppAlarmService);
  private workGroupService = inject(WorkCalendarService);

  rowClicked = output<WorkCalendar | undefined>();
  rowDoubleClicked = output<WorkCalendar | undefined>();
  editButtonClicked = output<WorkCalendar | undefined>();

  _data: WorkCalendar[] = [];

  columnDefs: ColDef[] = [
    /*{
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',
        width: 40,
        cellStyle: {'text-align': 'center'},
        suppressSizeToFit: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
    },*/
    {
        headerName: 'Id',
        field: 'id',
        width: 40,
        suppressSizeToFit: true,
        hide: true
    },
    {
      headerName: '',
      width: 10,
      suppressSizeToFit: true,
      cellStyle: params => {
        console.log(params);
        return {'background-color': params.data.color};
      }
    },
    {
      headerName: 'CALENDAR',
      field: 'name',
      width: 140
    }
  ];

  getRowId: GetRowIdFunc<any> = (params: GetRowIdParams<any>) => {
    return params.data.id;
  };

  ngOnInit(): void {

  }

  getMyWorkGroupList(): void {
    this.workGroupService
        .getMyWorkGroupList()
        .subscribe(
          (model: ResponseList<WorkCalendar>) => {
            this._data = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();
    let ids = selectedRows.map((v: { id: any; }) => v.id)   // id 추출
                          .join(',');       // 콤마 구분자로 분리함
    this.rowClicked.emit(ids);
    // console.log('ids ' + ids);
  }

  rowDbClicked(event: RowDoubleClickedEvent<WorkCalendar>): void {
    this.rowDoubleClicked.emit(event.data);
  }

}
