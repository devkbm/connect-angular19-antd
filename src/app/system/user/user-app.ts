import { Component, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShapeComponent } from "src/app/core/app/shape.component";
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

import { UesrSearchComponent } from './uesr-search.component';
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

@Component({
  selector: 'user-app',
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
export class UserApp implements OnInit {

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
    user: { visible: boolean, formDataId: any }
  } = {
    user: { visible: false, formDataId: null }
  }

  ngOnInit() {
  }

  newForm() {
    this.drawer.user.formDataId = null;
    this.drawer.user.visible = true;

  }

  editForm(item: User) {
    this.drawer.user.formDataId = item.userId;
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
    const userId: string = this.drawer.user.formDataId;
    const url = GlobalProperty.serverUrl() + `/api/system/user/${userId}`;
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
    this.drawer.user.formDataId = params.userId;
  }

}

