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

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { WordService } from './word.service';
import { Word } from './word.model';


@Component({
  selector: 'app-word-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="list"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [getRowId]="getRowId"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDbClickedFunc($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class WordGridComponent extends AgGridCommon implements OnInit {

  private service = inject(WordService);
  private appAlarmService = inject(AppAlarmService);

  rowClicked = output<Word>();
  rowDoubleClicked = output<Word>();
  editButtonClicked = output<Word>();

  list: Word[] = [];

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
    {headerName: '논리명',        field: 'logicalName',     width: 100 },
    {headerName: '물리명',        field: 'physicalName',    width: 100 },
    {headerName: '논리명(영문)',  field: 'logicalNameEng',  width: 100 },
    {headerName: '비고',          field: 'comment',         width: 400 }
  ];

  getRowId: GetRowIdFunc<Word> = (params: GetRowIdParams<Word>) => {
    return params.data.logicalName!;
  };

  ngOnInit() {
    this.getList();
  }

  getList(params?: any): void {
    this.service
        .getList()
        .subscribe(
          (model: ResponseList<Word>) => {
            if (model.data) {
              this.list = model.data;
            } else {
              this.list = [];
            }
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  rowClickedFunc(event: RowClickedEvent<Word>) {
    this.rowClicked.emit(event.data!);
  }

  rowDbClickedFunc(event: RowDoubleClickedEvent<Word>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}
