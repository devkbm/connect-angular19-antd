import { Component, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShapeComponent } from "src/app/core/app/shape.component";
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders, getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

import { UserGridComponent } from './user-grid.component';
import { UserFormDrawerComponent } from './user-form-drawer.component';
import { User } from './user.model';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';
import { NzButtonExcelUploadComponent } from "src/app/third-party/ng-zorro/nz-button-excel-upload/nz-button-excel-upload.component";
import { UesrSearchComponent } from './uesr-search.component';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule,
    NzDividerModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    NzButtonExcelUploadComponent,
    UserGridComponent,
    UserFormDrawerComponent,
    ShapeComponent,
    UesrSearchComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="사용자 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
    <app-uesr-search
      (search)="getUserList($event)"
      (newForm)="newForm()"
      (deleteForm)="deleteUser()"
    >
    </app-uesr-search>
    <!--
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
          <ng-template #addOnBeforeTemplate>
            <nz-select [(ngModel)]="query.user.key">
              @for (option of query.user.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
              }
            </nz-select>
          </ng-template>
          <input type="text" [(ngModel)]="query.user.value" nz-input placeholder="input search text" (keyup.enter)="getUserList()">
          <ng-template #suffixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </nz-input-group>
      </div>

      <div nz-col [nzSpan]="12" style="text-align: right;">
        <app-nz-button-excel-upload [urn]="'/api/system/user-excel'">
        </app-nz-button-excel-upload>

        <button nz-button (click)="getUserList()">
          <span nz-icon nzType="search"></span>조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="newForm()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button nzDanger="true"
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="deleteUser()" (nzOnCancel)="false">
            <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
      </div>
    </div>
    -->
  </app-nz-search-area>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">사용자 목록</h3>
    </div>

    <div style="flex: 1">
      @defer {
      <app-user-grid #userGrid
        (rowClicked)="userGridSelected($event)"
        (editButtonClicked)="editForm($event)"
        (rowDoubleClicked)="editForm($event)">
      </app-user-grid>
      }
    </div>
  </div>
</app-shape>

<app-user-form-drawer
  [drawer]="drawer.user"
  (drawerClosed)="getUserList('')">
</app-user-form-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.grid-title {
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

[nz-button] {
  margin: auto;
}
  `
})
export class UserComponent implements OnInit {

  private http = inject(HttpClient);

  grid = viewChild.required(UserGridComponent);

  query: {
    user : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    user : {
      key: 'userId',
      value: '',
      list: [
        {label: '아이디', value: 'userId'},
        {label: '성명', value: 'name'}
      ]
    }
  }

  drawer: {
    user: { visible: boolean, formInitId: any }
  } = {
    user: { visible: false, formInitId: null }
  }

  ngOnInit() {
  }

  newForm() {
    this.drawer.user.formInitId = null;
    this.drawer.user.visible = true;

  }

  editForm(item: User) {
    this.drawer.user.formInitId = item.userId;
    this.drawer.user.visible = true;
  }

  getUserList(params: any) {
    /*
    let params: any = new Object();
    if ( this.query.user.value !== '') {
      params[this.query.user.key] = this.query.user.value;
    }
*/
    this.drawer.user.visible = false;

    this.grid().gridQuery.set(params);
  }

  deleteUser() {
    const userId: string = this.drawer.user.formInitId;
    const url = GlobalProperty.serverUrl + `/api/system/user/${userId}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<User>>(url, options).pipe(
      //     catchError(this.handleError<ResponseObject<User>>('deleteUser', undefined))
        )
        .subscribe(
          (model: ResponseObject<User>) => {
          }
        )
  }

  userGridSelected(params: User) {
    this.drawer.user.formInitId = params.userId;
  }

}

