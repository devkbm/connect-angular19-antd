import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonTemplate, NzButtonsComponent } from 'src/app/third-party/ng-zorro/nz-buttons/nz-buttons.component';
import { NzPageHeaderCustomComponent } from "src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component";
import { NzSearchAreaComponent } from "src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component";

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { CompanyFormDrawerComponent } from "./company-form-drawer.component";

import { CompanyGridService } from './company-grid.service';
import { CompanyGridComponent } from './company-grid.component';
import { ShapeComponent } from "src/app/core/app/shape.component";

@Component({
  selector: 'app-company',
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
    CompanyGridComponent,
    CompanyFormDrawerComponent,
    ShapeComponent
],
  template: `

<ng-template #header>
  <nz-page-header-custom title="회사 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
          <input type="text" [(ngModel)]="query.company.value" nz-input placeholder="input search text" (keyup.enter)="getList()">
        </nz-input-group>

        <ng-template #addOnBeforeTemplate>
          <nz-select [(ngModel)]="query.company.key">
            @for (option of query.company.list; track option.value) {
              <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>
        </ng-template>

        <ng-template #suffixIconSearch>
          <span nz-icon nzType="search"></span>
        </ng-template>
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
      <h3 class="grid-title">회사 목록 {{drawer| json}} </h3>
    </div>
    <div style="flex: 1">
    @defer {
      <app-company-grid #grid
        (rowClicked)="resourceGridRowClicked($event)"
        (editButtonClicked)="editResource($event)"
        (rowDoubleClicked)="editResource($event)">
      </app-company-grid>
    }
    </div>
  </div>
</app-shape>

<app-company-form-drawer
  [drawer]="drawer.company"
  (drawerClosed)="getList()">
</app-company-form-drawer>

  `,
  styles: `
  :host {
    --page-header-height: 98px;
    --page-search-height: 46px;
  }

  .grid-title {
    height: 26px;
    margin-top: 6px;
    margin-left: 6px;
    padding-left: 6px;
    border-left: 6px solid green;
    vertical-align: text-top;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  `
})
export class CompanyComponent implements OnInit {

  private service = inject(CompanyGridService);

  grid = viewChild.required(CompanyGridComponent);

  query: {
    company : { key: string, value: string, list: {label: string, value: string}[] }
  } = {
    company : {
      key: 'resourceCode',
      value: '',
      list: [
        {label: '회사코드', value: 'resourceCode'},
        {label: '회사명', value: 'resourceName'},
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
    company: { visible: boolean, formInitId: any }
  } = {
    company: { visible: false, formInitId: null }
  }

  ngOnInit(): void {
  }

  getList(): void {
    let params: any = new Object();
    if ( this.query.company.value !== '') {
      params[this.query.company.key] = this.query.company.value;
    }

    this.drawer.company.visible = false;

    this.grid().getList();
  }

  newResource(): void {
    this.drawer.company.formInitId = null;
    this.drawer.company.visible = true;
  }

  editResource(item: any): void {
    this.drawer.company.formInitId = item.companyCode;
    this.drawer.company.visible = true;
  }

  delete(): void {

    const id = this.grid().getSelectedRows()[0].companyCode;
/*
    this.service
        .delete(id)
        .subscribe(
          (model: ResponseObject<Company>) => {
            this.getList();
          }
        );
*/
  }

  resourceGridRowClicked(item: any): void {
    this.drawer.company.formInitId = item.companyCode;
  }

}