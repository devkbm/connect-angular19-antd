import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ShapeComponent } from "src/app/core/app/shape.component";
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

import { WebResourceGridComponent } from './web-resource-grid.component';
import { WebResource } from './web-resource.model';
import { WebResourceFormDrawerComponent } from './web-resource-form-drawer.component';

import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';
import { ButtonTemplate, NzButtonsComponent } from 'src/app/third-party/ng-zorro/nz-buttons/nz-buttons.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-web-resource',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzButtonsComponent,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    WebResourceGridComponent,
    WebResourceFormDrawerComponent,
    ShapeComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="리소스 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>>

<ng-template #search>
  <app-nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
          <ng-template #addOnBeforeTemplate>
            <nz-select [(ngModel)]="query.resource.key">
              @for (option of query.resource.list; track option.value) {
                <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
              }
            </nz-select>
          </ng-template>
          <input type="text" [(ngModel)]="query.resource.value" nz-input placeholder="input search text" (keyup.enter)="getList()">
          <ng-template #suffixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </nz-input-group>
      </div>
      <div nz-col [nzSpan]="12" style="text-align: right;">
        <app-nz-buttons [buttons]="buttons"></app-nz-buttons>
        <!--
        <button nz-button (click)="getList()">
          <span nz-icon nzType="search"></span>조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="initForm()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button nzDanger="true"
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="delete()" (nzOnCancel)="false">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
        -->
      </div>
    </div>
  </app-nz-search-area>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">웹서버 리소스 목록</h3>
    </div>

    <div style="flex: 1">
    @defer {
      <app-web-resource-grid #grid
        (rowClicked)="resourceGridRowClicked($event)"
        (editButtonClicked)="editResource($event)"
        (rowDoubleClicked)="editResource($event)">
      </app-web-resource-grid>
    }
    </div>
  </div>
</app-shape>


<app-web-resource-form-drawer
  [drawer]="drawer.resource"
  (drawerClosed)="getList()">
</app-web-resource-form-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.grid-title {
  height: 26px;
  margin-top: 6px;
  margin-left: 6px;
  padding-left: 6px;
  border-left: 6px solid green;
  vertical-align: text-top;
}
`
})
export class WebResourceComponent implements OnInit {

  private http = inject(HttpClient);

  grid = viewChild.required(WebResourceGridComponent);

  query: {
    resource : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    resource : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '리소스코드', value: 'resourceCode'},
        {label: '리소스명', value: 'resourceName'},
        {label: 'URL', value: 'url'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  buttons: ButtonTemplate[] = [{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getList();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.newResource();
    }
  },{
    text: '삭제',
    nzType: 'delete',
    isDanger: true,
    popConfirm: {
      title: '삭제하시겠습니까?',
      confirmClick: () => {
        this.delete();
      }
    }
  }];

  drawer: {
    resource: { visible: boolean, formInitId: any }
  } = {
    resource: { visible: false, formInitId: null }
  }

  ngOnInit(): void {
  }

  getList(): void {
    let params: any = new Object();
    if ( this.query.resource.value !== '') {
      params[this.query.resource.key] = this.query.resource.value;
    }

    this.drawer.resource.visible = false;
    this.grid().gridQuery.set(params);
  }

  newResource(): void {
    this.drawer.resource.formInitId = null;
    this.drawer.resource.visible = true;
  }

  editResource(item: any): void {
    this.drawer.resource.formInitId = item.resourceId;
    this.drawer.resource.visible = true;
  }

  delete(): void {
    const id = this.grid().getSelectedRows()[0].resourceId;

    const url = GlobalProperty.serverUrl + `/api/system/webresource/${id}`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    this.http.delete<ResponseObject<WebResource>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseObject<WebResource>) => {
        this.getList();
      }
    );

  }

  resourceGridRowClicked(item: any): void {
    this.drawer.resource.formInitId = item.resourceId;
  }

}
