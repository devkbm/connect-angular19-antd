import { AfterViewInit, Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ShapeComponent } from "src/app/core/app/shape.component";

import { RoleGridComponent } from './role-grid.component';
import { RoleFormDrawerComponent } from './role-form-drawer.component';
import { Role } from './role.model';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { ButtonTemplate, NzButtonsComponent } from 'src/app/third-party/ng-zorro/nz-buttons/nz-buttons.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-role',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzGridModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzButtonsComponent,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    RoleGridComponent,
    RoleFormDrawerComponent,
    ShapeComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom class="page-header" title="롤 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
          <ng-template #addOnBeforeTemplate>
            <nz-select [(ngModel)]="query.role.key">
              @for (option of query.role.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
              }
            </nz-select>
          </ng-template>
          <input type="text" [(ngModel)]="query.role.value" nz-input placeholder="input search text" (keyup.enter)="getRoleList()">
          <ng-template #suffixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </nz-input-group>
      </div>

      <div nz-col [nzSpan]="12" style="text-align: right;">
        <app-nz-buttons [buttons]="buttons"></app-nz-buttons>
      </div>
    </div>
  </app-nz-search-area>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">롤 목록</h3>
    </div>

    <div style="flex: 1">
      @defer {
      <app-role-grid #authGrid
        (rowClicked)="selectedItem($event)"
        (editButtonClicked)="editDrawOpen($event)"
        (rowDoubleClicked)="editDrawOpen($event)">
      </app-role-grid>
      }
    </div>
  </div>
</app-shape>

<app-role-form-drawer
  [drawer]="drawer.role"
  (drawerClosed)="getRoleList()">
</app-role-form-drawer>

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
  margin-top: var(--page-content-title-margin-height);
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

[nz-button] {
  margin: auto;
}
  `
})
export class RoleApp implements AfterViewInit {

  private http = inject(HttpClient);

  grid = viewChild.required(RoleGridComponent);

  query: {
    role : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    role : {
      key: 'roleCode',
      value: '',
      list: [
        {label: '롤', value: 'roleCode'},
        {label: '설명', value: 'description'}
      ]
    }
  }

  drawer: {
    role: { visible: boolean, formDataId: any }
  } = {
    role: { visible: false, formDataId: null }
  }

  buttons: ButtonTemplate[] = [{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getRoleList();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.initForm();
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

  ngAfterViewInit(): void {
  }

  openDrawer() {
    this.drawer.role.visible = true;
  }

  closeDrawer() {
    this.drawer.role.visible = false;
  }

  selectedItem(data: any) {
    if (data) {
      this.drawer.role.formDataId = data.roleCode;
    } else {
      this.drawer.role.formDataId = null;
    }
  }

  initForm() {
    this.drawer.role.formDataId = null;

    this.openDrawer();
  }

  editDrawOpen(item: any) {
    this.openDrawer();
  }

  getRoleList() {
    let params: any = new Object();
    if ( this.query.role.value !== '') {
      params[this.query.role.key] = this.query.role.value;
    }

    this.closeDrawer();
    this.grid().gridQuery.set(params);
  }

  delete() {
    const id = this.grid().getSelectedRows()[0].roleCode;
    const url = GlobalProperty.serverUrl() + `/api/system/role/${id}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<Role>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<Role>) => {
            this.getRoleList();
          }
        )
  }

}
