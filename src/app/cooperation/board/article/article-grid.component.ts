import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, FirstDataRenderedEvent, GridSizeChangedEvent, RowClickedEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ModuleRegistry, ClientSideRowModelModule, RowSelectionModule } from 'ag-grid-community';
import { GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowSelectionModule,
]);
import { AgGridCommon } from 'src/app/third-party/ag-grid/ag-grid-common';
import { ButtonRendererComponent } from 'src/app/third-party/ag-grid/renderer/button-renderer.component';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseList } from 'src/app/core/model/response-list';

import { ArticleService } from './article.service';
import { Article } from './article.model';


@Component({
  selector: 'app-article-grid',
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
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridSizeChanged)="onGridSizeChanged($event)"
      (rowClicked)="rowClickedEvent($event)"
      (rowDoubleClicked)="rowDbClicked($event)">
    </ag-grid-angular>
  `
})
export class ArticleGridComponent extends AgGridCommon implements OnInit {

  private appAlarmService = inject(AppAlarmService);
  private boardService = inject(ArticleService);

  rowClicked = output<Article | undefined>();
  rowDoubleClicked = output<Article | undefined>();
  editButtonClicked = output<Article | undefined>();

  _data: Article[] = [];

  columnDefs: ColDef[] = [
    {
        headerName: '번호',
        //valueGetter: 'node.rowIndex + 1',
        field: 'articleId',
        width: 70,
        cellStyle: {'text-align': 'center'},
        suppressSizeToFit: true
    },
    {
        headerName: '제목',
        field: 'title'
    },
    {
      headerName: '등록일자',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'createdDt',
      width: 210,
      cellStyle: {'text-align': 'center'},
      suppressSizeToFit: true
    },
    {
      headerName: '수정일자',
      cellRenderer: (data: any) => {
        return new Date(data.value).toLocaleString();
      },
      field: 'modifiedDt',
      width: 210,
      cellStyle: {'text-align': 'center'},
      suppressSizeToFit: true
    },
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px'},
      cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      },
      suppressSizeToFit: true
    }
  ];

  getRowId: GetRowIdFunc<Article> = (params: GetRowIdParams<Article>) => {
    return params.data.articleId;
  };

  ngOnInit() {
    //this.setWidthAndHeight('100%', '100%');
  }

  getArticleList(fkBoard: any): void {
    this.boardService
        .getArticleList(fkBoard)
        .subscribe(
          (model: ResponseList<Article>) => {
            this._data = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  rowClickedEvent(params: RowClickedEvent<Article>) {
    const selectedRows = params.api.getSelectedRows();
    this.rowClicked.emit(selectedRows[0]);
  }

  rowDbClicked(params: RowDoubleClickedEvent<Article>) {
    this.rowDoubleClicked.emit(params.data);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    /*
    var gridWidth = document.getElementById("grid-wrapper").offsetWidth;
    var columnsToShow = [];
    var columnsToHide = [];
    var totalColsWidth = 0;
    var allColumns = this.gridColumnApi.getAllColumns();

    for (var i = 0; i < allColumns.length; i++) {
      let column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    */
        /*
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
    */

    //this.gridColumnApi.setColumnsVisible(columnsToShow, true);
    //this.gridColumnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

}
