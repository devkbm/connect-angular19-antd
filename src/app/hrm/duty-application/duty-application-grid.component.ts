
import { Component, OnInit, inject, output } from '@angular/core';
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

import { DutyApplicationService } from './duty-application.service';
import { DutyApplication } from './duty-application.model';


@Component({
  selector: 'app-duty-application-grid',
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
  `,
  styles: [`
  `]
})
export class DutyApplicationGridComponent extends AgGridCommon implements OnInit {

  private appAlarmService = inject(AppAlarmService);
  private dutyApplicationService = inject(DutyApplicationService);

  _data: DutyApplication[] = [];

  rowClicked = output<DutyApplication | undefined>();
  rowDoubleClicked = output<DutyApplication | undefined>();
  editButtonClicked = output<DutyApplication | undefined>();

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
      width: 70,
      cellStyle: {'text-align': 'center'}
    },
    { headerName: '근태신청ID',         field: 'id',              width: 80 },
    { headerName: '사원번호',           field: 'staffNo',             width: 80 },
    { headerName: '근태코드',           field: 'dutyCode',            width: 80 },
    { headerName: '근태사유',           field: 'dutyReason',          width: 80 },
    { headerName: '근태시작일시',       field: 'dutyStartDateTime',   width: 80 },
    { headerName: '근태근태종료일시',   field: 'dutyEndDateTime',     width: 80 }
  ];

  getRowId: GetRowIdFunc<DutyApplication> = (params: GetRowIdParams<DutyApplication>) => {
    return params.data.dutyId!;
  };

  ngOnInit() {
    this.getGridList('TEST');
  }

  public getGridList(staffNo: string): void {
    const params = {
      staffId : staffNo
    };

    this.dutyApplicationService
        .getList(params)
        .subscribe(
          (model: ResponseList<DutyApplication>) => {
            if (model.data) {
              this._data = model.data;
            } else {
              this._data = [];
            }
            this.appAlarmService.changeMessage(model?.message);
          }
        );
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<DutyApplication>) {
    this.rowDoubleClicked.emit(event.data);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

}

