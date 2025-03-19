import { Component, OnInit, Input, OnChanges, SimpleChanges, inject, output } from '@angular/core';
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

import { StaffSchoolCareer } from './staff-school-career.model';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';


@Component({
  selector: 'app-staff-school-career-grid',
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
export class StaffSchoolCareerGridComponent extends AgGridCommon implements OnInit, OnChanges {

  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  protected _list: StaffSchoolCareer[] = [];

  @Input() staffId?: string;

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();
  editButtonClicked = output<any>();

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
    { headerName: '학력',           field: 'schoolCareerTypeName',  width: 100 },
    { headerName: '학교',           field: 'schoolCodeName',        width: 150 },
    { headerName: '입학일',         field: 'fromDate',          width: 90 },
    { headerName: '졸업일',         field: 'toDate',            width: 90 },
    { headerName: '전공',           field: 'majorName',         width: 100 },
    { headerName: '부전공',         field: 'pluralMajorName',   width: 100 },
    { headerName: '지역',           field: 'location',          width: 100 },
    { headerName: '수업연한',       field: 'lessonYear',        width: 100 },
    { headerName: '비고',           field: 'comment',           width: 200 }
  ];

  getRowId: GetRowIdFunc<StaffSchoolCareer> = (params: GetRowIdParams<StaffSchoolCareer>) => {
    return params.data.staffNo! + params.data.seq!;
  };

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staffId'].currentValue) {
      this.getList(changes['staffId'].currentValue);
    }
  }

  getList(staffId: string): void {
    const url = GlobalProperty.serverUrl + `/api/hrm/staff/${staffId}/schoolcareer`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    this.http.get<ResponseList<StaffSchoolCareer>>(url, options).pipe(
      //catchError(this.handleError<ResponseList<StaffSchoolCareer>>('getList', undefined))
    ).subscribe(
      (model: ResponseList<StaffSchoolCareer>) => {
        this._list = model.data;
        this.notifyService.changeMessage(model.message);
      }
    );
  }

  selectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();

    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(event: RowDoubleClickedEvent<StaffSchoolCareer>) {
    this.rowDoubleClicked.emit(event.data);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }
}
