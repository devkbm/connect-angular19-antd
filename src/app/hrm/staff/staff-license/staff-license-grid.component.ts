import { Component, Input, OnChanges, SimpleChanges, inject, output } from '@angular/core';
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

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffLicense } from './staff-license.model';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

@Component({
  selector: 'app-staff-license-grid',
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
      (selectionChanged)="selectionChanged($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `,
  styles: []
})
export class StaffLicenseGridComponent extends AgGridCommon implements OnChanges {

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  protected _list: StaffLicense[] = [];

  @Input() staffId?: string;

  rowClicked = output<StaffLicense>();
  rowDoubleClicked = output<StaffLicense>();
  editButtonClicked = output<StaffLicense>();

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
    { headerName: '자격면허',       field: 'licenseTypeName',         width: 90 },
    { headerName: '자격면허번호',   field: 'licenseNumber',           width: 150 },
    { headerName: '취득일',         field: 'dateOfAcquisition',       width: 200 },
    { headerName: '인증기관',       field: 'certificationAuthority',  width: 100 },
    { headerName: '비고',           field: 'comment',                 width: 100 }
  ];

  getRowId: GetRowIdFunc<StaffLicense> = (params: GetRowIdParams<StaffLicense>) => {
    return params.data.staffNo! + params.data.seq!;
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staffId'].currentValue) {
      this.getList(changes['staffId'].currentValue);
    }
  }

  getList(staffId: string): void {
    const url = GlobalProperty.serverUrl + `/api/hrm/staff/${staffId}/license`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    this.http.get<ResponseList<StaffLicense>>(url, options).pipe(
      //catchError(this.handleError<ResponseList<StaffLicense>>('getList', undefined))
    ).subscribe(
      (model: ResponseList<StaffLicense>) => {
        this._list = model.data;
      }
    );
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<StaffLicense>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }
}
