import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { TermService } from './term.service';
import { Term } from './term.model';
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';

@Component({
  selector: 'app-term-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="termList"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [getRowId]="getRowId"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDbClickedFunc($event)">
  </ag-grid-angular>
  `
})
export class TermGridComponent extends AgGridCommon implements OnInit {

  private termService = inject(TermService);
  private appAlarmService = inject(AppAlarmService);

  rowClicked = output<Term>();
  rowDoubleClicked = output<Term>();
  editButtonClicked = output<Term>();

  termList: Term[] = [];

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
    {headerName: '용어ID',      field: 'termId',            width: 200 },
    {headerName: '시스템',      field: 'system',            width: 100 },
    {headerName: '용어',        field: 'term',              width: 200 , tooltipField: 'term'},
    {headerName: '용어(영문)',  field: 'termEng',           width: 150 },
    {headerName: '컬럼명',      field: 'columnName',        width: 200 },
    {headerName: '도메인명',    field: 'dataDomainName',    width: 100 },
    {headerName: '설명',        field: 'description',       width: 400 },
    {headerName: '비고',        field: 'comment',           width: 400 }
  ];

  getRowId: GetRowIdFunc<Term> = (params: GetRowIdParams<Term>) => {
      return params.data.termId!;
  };

  ngOnInit() {
    this.getList();
  }

  getList(params?: any): void {
    this.termService
        .getTermList(params)
        .subscribe(
          (model: ResponseList<Term>) => {
            if (model.data) {
              this.termList = model.data;
            } else {
              this.termList = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  rowClickedFunc(event: RowClickedEvent<Term>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClickedFunc(event: RowDoubleClickedEvent<Term>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
