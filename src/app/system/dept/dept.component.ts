import { AfterViewInit, Component, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DeptTreeComponent } from './dept-tree.component';
import { DeptFormComponent } from './dept-form.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { ShapeComponent } from "src/app/core/app/shape.component";

@Component({
  selector: 'app-dept',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzDividerModule,
    NzPageHeaderCustomComponent,
    DeptTreeComponent,
    DeptFormComponent,
    ShapeComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="부서코드 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <div nz-row>
    <div nz-col [nzSpan]="12">
      <nz-input-group nzSearch [nzSuffix]="suffixIconSearch">
        <input type="text" [(ngModel)]="queryValue" nz-input placeholder="input search text">
      </nz-input-group>
      <ng-template #suffixIconSearch>
        <span nz-icon nzType="search"></span>
      </ng-template>
    </div>
    <div nz-col [nzSpan]="12" style="text-align: right;">
      <button nz-button (click)="getDeptTree()">
        <span nz-icon nzType="search"></span>조회
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button (click)="initForm()">
        <span nz-icon nzType="form" nzTheme="outline"></span>신규
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <!--
        nz-popconfirm nzPopconfirmTitle="저장하시겠습니까?"
        (nzOnConfirm)="saveDept()" (nzOnCancel)="false">
      -->
      <button nz-button nzType="primary" (click)="saveDept()">
        <span nz-icon nzType="save" nzTheme="outline"></span>저장
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <!--
        nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
        (nzOnConfirm)="deleteDept()" (nzOnCancel)="false">
      -->
      <button nz-button nzDanger (click)="deleteDept()">
        <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
      </button>
    </div>
  </div>
</ng-template>


<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">부서코드 목록</h3>
    </div>

    <div style="flex: 1">
      <div class="grid-wrapper">
        <app-dept-tree
          [searchValue]="queryValue"
          (itemSelected)="selectedItem($event)">
        </app-dept-tree>

        <app-dept-form
          (formSaved)="getDeptTree()"
          (formDeleted)="getDeptTree()">
        </app-dept-form>
      </div>
    </div>
  </div>
</app-shape>
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

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.grid-wrapper {
  display: grid;
  grid-template-columns: 200px 1fr;
}

  `
})
export class DeptComponent implements OnInit, AfterViewInit {

  tree = viewChild.required(DeptTreeComponent);
  form = viewChild.required(DeptFormComponent);

  queryValue = '';

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getDeptTree();
  }

  getDeptTree(): void {
    this.tree().getDeptHierarchy();
  }

  initForm(): void {
    this.form().newForm();
  }

  saveDept(): void {
    this.form().save();
  }

  deleteDept(): void {
    this.form().remove();
  }

  selectedItem(item: any): void {
    this.form().get(item.deptCode);
  }

}
