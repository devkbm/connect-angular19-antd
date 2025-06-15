import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MenuGroupGridComponent } from './menu-group-grid.component';
import { MenuGridComponent } from './menu-grid.component';
import { MenuFormDrawerComponent } from './menu-form-drawer.component';
import { MenuGroupFormDrawerComponent } from './menu-group-form-drawer.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';
import { ShapeComponent } from "src/app/core/app/shape.component";

@Component({
  selector: 'menu-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    MenuGroupGridComponent,
    MenuGridComponent,
    MenuGroupFormDrawerComponent,
    MenuFormDrawerComponent,
    ShapeComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="메뉴 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="8">
        <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
          <ng-template #addOnBeforeTemplate>
            <nz-select [(ngModel)]="query.menuGroup.key">
              @for (option of query.menuGroup.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
              }
            </nz-select>
          </ng-template>
          <input type="text" [(ngModel)]="query.menuGroup.value" nz-input placeholder="input search text" (keyup.enter)="getMenuGroupList()">
          <ng-template #suffixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </nz-input-group>
      </div>

      <div nz-col [nzSpan]="8">
        <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate2" [nzSuffix]="suffixIconSearch2">
          <ng-template #addOnBeforeTemplate2>
            <nz-select [(ngModel)]="query.menu.key">
              @for (option of query.menu.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
              }
            </nz-select>
          </ng-template>
          <input type="text" [(ngModel)]="query.menu.value" nz-input placeholder="input search text" (keyup.enter)="getMenuList()">
          <ng-template #suffixIconSearch2>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </nz-input-group>
      </div>

      <div nz-col [nzSpan]="8" style="text-align: right;">
        <button nz-button (click)="newMenuGroup()">
          <span nz-icon nzType="search"></span>메뉴그룹등록
        </button>
        <nz-divider nzType="vertical"></nz-divider>

        <button nz-button (click)="newMenu()">
          <span nz-icon nzType="form"></span>메뉴등록
        </button>
        <nz-divider nzType="vertical"></nz-divider>

        <button nz-button (click)="getMenuGroupList()">
          <span nz-icon nzType="form"></span>조회
        </button>

      </div>
    </div>
  </app-nz-search-area>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="page-content">
    <h3 class="header1">메뉴 그룹 목록</h3>
    @defer {
    <app-menu-group-grid class="grid1"
      (rowClicked)="menuGroupGridRowClicked($event)"
      (editButtonClicked)="editMenuGroup($event)"
      (rowDoubleClicked)="editMenuGroup($event)">
    </app-menu-group-grid>
    }
    <h3 class="header2">메뉴 목록</h3>
    @defer {
    <app-menu-grid class="grid2"
      (rowClicked)="menuGridRowClicked($event)"
      (editButtonClicked)="editMenu($event)"
      (rowDoubleClicked)="editMenu($event)">
    </app-menu-grid>
    }
  </div>
</app-shape>

<app-menu-group-form-drawer
  [drawer]="drawer.menuGroup"
  (drawerClosed)="getMenuGroupList()">
</app-menu-group-form-drawer>

<app-menu-form-drawer
  [drawer]="drawer.menu"
  (drawerClosed)="getMenuList()">
</app-menu-form-drawer>
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

.page-content {
  height: 100%;
  display: grid;
  grid-template-rows: 34px 1fr;
  grid-template-columns: 1fr 1.5fr;
  column-gap: 12px;
  grid-template-areas:
    "header1 header2"
    "grid1   grid2";
}

.text-align-right {
  text-align: right;
}

.header1 {
  grid-area: header1;
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.header2 {
  grid-area: header2;
  margin-left: 6px;
  border-left: 6px solid green;
  padding-left: 6px;
  vertical-align: text-top;
}

.grid1 {
  grid-area: grid1;
}

.grid2 {
  grid-area: grid2;
}

.footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding: 10px 16px;
  text-align: right;
  left: 0px;
  /*background: #fff;*/
}
  `
})
export class MenuApp {

  gridMenuGroup = viewChild.required(MenuGroupGridComponent);
  gridMenu = viewChild.required(MenuGridComponent);

  query: {
    menuGroup : { key: string, value: string, list: {label: string, value: string}[] },
    menu: { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    menuGroup : {
      key: 'menuGroupName',
      value: '',
      list: [
        {label: '메뉴그룹ID', value: 'menuGroupCode'},
        {label: '메뉴그룹명', value: 'menuGroupName'}
      ]
    },
    menu: {
      key: 'menuName',
      value: '',
      list: [
        {label: '메뉴ID', value: 'menuCode'},
        {label: '메뉴명', value: 'menuName'}
      ]
    }
  }

  drawer: {
    menuGroup: { visible: boolean, formDataId: any },
    menu: { visible: boolean, formDataId: any }
  } = {
    menuGroup: { visible: false, formDataId: null },
    menu: { visible: false, formDataId: null }
  }

  //#region 메뉴그룹
  getMenuGroupList(): void {
    let params: any = new Object();
    if ( this.query.menuGroup.value !== '') {
      params[this.query.menuGroup.key] = this.query.menuGroup.value;
    }

    this.drawer.menuGroup.visible = false;
    //this.gridMenu().clearData();
    this.gridMenuGroup().gridQuery.set(params);
  }

  newMenuGroup(): void {
    this.drawer.menuGroup.formDataId = null;
    this.drawer.menuGroup.visible = true;
  }

  editMenuGroup(item: any) {
    this.drawer.menuGroup.formDataId = item.menuGroupCode;
    this.drawer.menuGroup.visible = true;
  }

  menuGroupGridRowClicked(row: any): void {
    this.drawer.menuGroup.formDataId = row.menuGroupCode;
    this.drawer.menu.formDataId = {menuGroupCode: row.menuGroupCode};
    this.getMenuList();
  }
  //#endregion 메뉴그룹

  //#region 메뉴
  getMenuList(): void {
    let params: any = new Object();
    params['menuGroupCode'] = this.drawer.menuGroup.formDataId;

    if ( this.query.menu.value !== '') {
      params[this.query.menu.key] = this.query.menu.value;
    }

    this.drawer.menu.visible = false;
    this.gridMenu().gridQuery.set(params);
  }

  newMenu(): void {
    this.drawer.menu.visible = true;
  }

  editMenu(item: any) {
    this.drawer.menu.formDataId = {menuGroupCode: item.menuGroupCode, menuCode: item.menuCode};
    this.drawer.menu.visible = true;
  }

  menuGridRowClicked(row: any): void {
    this.drawer.menu.formDataId =  {menuGroupCode: row.menuGroupCode, menuCode: row.menuCode};
  }
  //#endregion 메뉴

}
