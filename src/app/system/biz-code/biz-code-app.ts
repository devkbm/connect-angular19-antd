import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BizCodeTypeGridComponent } from './biz-code-type-grid.component';
import { BizCodeGridComponent } from './biz-code-grid.component';
import { BizCodeTypeFormDrawerComponent } from "./biz-code-type-form-drawer.component";
import { BizCodeFormDrawerComponent } from "./biz-code-form-drawer.component";

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';
import { ShapeComponent } from "src/app/core/app/shape.component";


@Component({
  selector: 'biz-code-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    BizCodeTypeGridComponent,
    BizCodeGridComponent,
    BizCodeFormDrawerComponent,
    BizCodeTypeFormDrawerComponent,
    ShapeComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="업무코드 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="24" style="text-align: right">
        <button nz-button (click)="selectBizCodeTypeList()">
          <span nz-icon nzType="search" nzTheme="outline"></span>조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="newCodeType()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규 분류
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="newCode()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규 코드
        </button>
      </div>
    </div>
  </app-nz-search-area>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <h3 class="header1">업무코드분류</h3>
    @defer {
    <app-biz-type-grid class="grid1"
      (rowClicked)="codeTypeGridRowClicked($event)"
      (editButtonClicked)="editCodeType($event)"
      (rowDoubleClicked)="editCodeType($event)">
    </app-biz-type-grid>
    }
    <h3 class="header2">업무코드</h3>
    @defer {
    <app-biz-code-grid class="grid2"
      (rowClicked)="codeGridRowClicked($event)"
      (editButtonClicked)="editCode($event)"
      (rowDoubleClicked)="editCode($event)">
    </app-biz-code-grid>
    }
  </div>
</app-shape>

<app-biz-code-type-form-drawer
  [drawer]="drawer.codeType"
  (drawerClosed)="selectBizCodeTypeList()">
</app-biz-code-type-form-drawer>

<app-biz-code-form-drawer
  [drawer]="drawer.code"
  (drawerClosed)="selectBizCodeList()">
</app-biz-code-form-drawer>

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
  height: 100%;
  display: grid;
  grid-template-rows: 34px 1fr;
  grid-template-columns: 1fr 1fr;
  column-gap: 12px;
  grid-template-areas:
    "header1 header2"
    "grid1   grid2";
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
  `
})
export class BizCodeApp {

  gridCodeType = viewChild.required(BizCodeTypeGridComponent);
  gridCode = viewChild.required(BizCodeGridComponent);

  drawer: {
    codeType: { visible: boolean, formDataId: any },
    code: { visible: boolean, formDataId: any }
  } = {
    codeType: { visible: false, formDataId: null },
    code: { visible: false, formDataId: null }
  }

  selectBizCodeTypeList() {
    this.drawer.codeType.visible = false;

    this.gridCodeType().getList();
  }

  newCodeType() {
    this.drawer.codeType.formDataId = null;
    this.drawer.codeType.visible = true;
  }

  editCodeType(params: any) {
    this.drawer.codeType.formDataId = params.typeId;
    this.drawer.codeType.visible = true;
  }

  codeTypeGridRowClicked(params: any) {
    this.drawer.codeType.formDataId = params.typeId;
    this.drawer.code.formDataId = {typeId: params.typeId};

    this.gridCode().getList(this.drawer.code.formDataId.typeId);
  }

  selectBizCodeList() {
    this.drawer.code.visible = false;
    this.gridCode().getList(this.drawer.code.formDataId.typeId);
  }

  newCode() {
    this.drawer.code.visible = true;
  }

  editCode(params: any) {
    this.drawer.code.formDataId = {typeId: params.typeId, code: params.code};
    this.drawer.code.visible = true;
  }

  codeGridRowClicked(params: any) {
    this.drawer.code.formDataId = {typeId: params.typeId, code: params.code};
  }

}
