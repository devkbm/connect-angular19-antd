import { Component, OnInit, computed, inject, output, signal } from '@angular/core';
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

import { HolidayService } from './holiday.service';
import { DateInfo, Holiday } from './holiday.model';

@Component({
  selector: 'app-holiday-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="gridList()"
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
export class HolidayGridComponent implements OnInit {

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

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "singleRow",
    checkboxes: false,
    enableClickSelection: true
  };

  //gridList: Holiday[] = [];
  gridList = signal<DateInfo[]>([]);
  filteredList = computed(() => {
    let dateList: Date[] = this.gridList().filter((e) => { return (e.holiday?.holidayName ?? '') !== ''} )
                                          .map((e) => e.date!);
    let obj : any[] = [];
    dateList.forEach((element, index) => {
      obj.push({start: element, end: element});
    });
    return obj;
  });

  private appAlarmService = inject(AppAlarmService);
  private holidayService = inject(HolidayService);

  defaultColDef: ColDef = { sortable: true, resizable: true };

  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px', 'margin': '0px' },
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
    { headerName: '일자',     field: 'date',                width: 110,   cellStyle: { textAlign: 'center'} },
    { headerName: '요일',     field: 'dayOfWeek',           width: 50,    cellStyle: {'text-align': 'center'} },
    { headerName: '휴일명',   field: 'holiday.holidayName', width: 150 },
    { headerName: '비고',     field: 'holiday.comment',     width: 200 }
  ];

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.date;
  };

  ngOnInit(): void {
    //this.getGridList();
  }

  getGridList(fromDate: string, toDate: string): void {

    this.holidayService
        .getHolidayList(fromDate, toDate)
        .subscribe(
          (model: ResponseList<DateInfo>) => {
            this.gridList.set(model.data);
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  onEditButtonClick(e: any): void {
    this.editButtonClicked.emit(e.rowData);
  }

  selectionChanged(event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: any): void {
    this.rowDoubleClicked.emit(event.data);
  }

}
