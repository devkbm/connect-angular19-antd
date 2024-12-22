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

import { BizCodeType } from './biz-code-type.model';
import { BizCodeTypeService } from './biz-code-type.service';


@Component({
  selector: 'app-biz-type-grid',
  imports: [
    CommonModule,
    AgGridAngular
  ],
  template: `
    <ag-grid-angular
      [theme]="theme"
      [rowData]="_list"
      [style.height]="'100%'"
      [rowSelection]="rowSelection"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [getRowId]="getRowId"
      (gridReady)="onGridReady($event)"
      (rowClicked)="rowClickedFunc($event)"
      (rowDoubleClicked)="rowDoubleClickedFunc($event)">
    </ag-grid-angular>
  `
})
export class BizCodeTypeGridComponent extends AgGridCommon implements OnInit {

  private service = inject(BizCodeTypeService);
  private appAlarmService = inject(AppAlarmService);

  _list: BizCodeType[] = [];

  rowClicked = output<BizCodeType>();
  rowDoubleClicked = output<BizCodeType>();
  editButtonClicked = output<BizCodeType>();

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
      width: 65,
      cellStyle: {'text-align': 'center'}
    },
    { headerName: '시스템',       field: 'bizType',       width: 80 },
    { headerName: '분류ID',       field: 'typeId',        width: 100 },
    { headerName: '분류명',       field: 'typeName',      width: 200 },
    { headerName: '순번',         field: 'sequence',      width: 50 },
    { headerName: '비고',         field: 'comment',       width: 400 }
  ];

  getRowId: GetRowIdFunc<BizCodeType> = (params: GetRowIdParams<BizCodeType>) => {
    return params.data.typeId!;
  };

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.service
        .getList()
        .subscribe(
          (model: ResponseList<BizCodeType>) => {
            this._list = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );

  }

  rowClickedFunc(event: RowClickedEvent<BizCodeType>): void {
    this.rowClicked.emit(event.data!);
  }

  rowDoubleClickedFunc(event: RowDoubleClickedEvent<BizCodeType>): void {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: any): void {
    this.editButtonClicked.emit(e.rowData);
  }

}
