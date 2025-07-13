import { Component, OnInit, inject, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponseList } from 'src/app/core/model/response-list';

import { CommonCodeFormComponent } from './common-code-form.component';
import { CommonCodeTreeComponent } from './common-code-tree.component';
import { CommonCodeService } from './common-code.service';
import { SystemTypeEnum } from './system-type-enum.model';
import { ButtonTemplate, NzButtonsComponent } from 'src/app/third-party/ng-zorro/nz-buttons/nz-buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';
import { ShapeComponent } from "src/app/core/app/shape.component";

@Component({
  selector: 'common-code-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    CommonCodeTreeComponent,
    CommonCodeFormComponent,
    ShapeComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="공통코드 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
    <div nz-row>
      <div nz-col [nzSpan]="12">
        <nz-input-group nzSearch [nzAddOnBefore]="addOnBeforeTemplate" [nzSuffix]="suffixIconSearch">
          <input type="text" [(ngModel)]="queryValue" nz-input placeholder="input search text">
        </nz-input-group>
        <ng-template #addOnBeforeTemplate>
          <nz-select [(ngModel)]="systeTypeCode">
            @for (option of systemTypeCodeList; track option.value) {
            <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            }
          </nz-select>
        </ng-template>
        <ng-template #suffixIconSearch>
          <span nz-icon nzType="search"></span>
        </ng-template>
      </div>
      <div nz-col [nzSpan]="12" style="text-align: right;">
        <!--<app-nz-buttons [buttons]="buttons"></app-nz-buttons>-->

        <button nz-button nzType="primary" (click)="getCommonCodeTree()">
          <span nz-icon nzType="search"></span>조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button (click)="newForm()">
          <span nz-icon nzType="form" nzTheme="outline"></span>신규
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button nzType="primary"
          nz-popconfirm nzPopconfirmTitle="저장하시겠습니까?"
          (nzOnConfirm)="saveCommonCode()" (nzOnCancel)="false">
          <span nz-icon nzType="save" nzTheme="outline"></span>저장
        </button>
        <nz-divider nzType="vertical"></nz-divider>
        <button nz-button nzDanger="true"
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="deleteCommonCode()" (nzOnCancel)="false">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>

      </div>
    </div>
  </app-nz-search-area>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="pgm-title">공통코드 목록</h3>
    </div>

    <div class="grid-wrapper">
      <app-common-code-tree #commonCodeTree
        [searchValue]="queryValue"
        (itemSelected)="selectedItem($event)">
      </app-common-code-tree>

      <app-common-code-form #commonCodeForm
        (formSaved)="getCommonCodeTree()"
        (formDeleted)="getCommonCodeTree()">
      </app-common-code-form>
    </div>
  </div>
</app-shape>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
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

.grid-wrapper {
  display: grid;
  grid-template-rows: 24px 1fr;
  grid-template-columns: 200px 1fr;
}

  `
})
export class CommonCodeApp implements OnInit, AfterViewInit {

  tree = viewChild.required(CommonCodeTreeComponent);
  form = viewChild.required(CommonCodeFormComponent);

  systemTypeCodeList: SystemTypeEnum[] = [];

  systeTypeCode = 'COM';
  queryValue = '';
  selectedCode = '';

  buttons: ButtonTemplate[] = [{
    text: '조회',
    nzType: 'search',
    click: (e: MouseEvent) => {
      this.getCommonCodeTree();
    }
  },{
    text: '신규',
    nzType: 'form',
    click: (e: MouseEvent) => {
      this.newForm();
    }
  },{
    text: '저장',
    nzType: 'save',
    popConfirm: {
      title: '저장하시겠습니까?',
      confirmClick: () => {
        this.saveCommonCode();
      }
    }
  },{
    text: '삭제',
    nzType: 'delete',
    isDanger: true,
    popConfirm: {
      title: '삭제하시겠습니까?',
      confirmClick: () => {
        this.deleteCommonCode();
      }
    }
  }];

  private commonCodeService = inject(CommonCodeService);

  /*
  col = 8;
  id = -1;
  directions: NzResizeHandleOption[] = [
    {
      direction: 'right',
      cursorType: 'grid'
    }
  ];

  onResize({ col }: NzResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.col = col!;
    });
  }
*/
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getSystemTypeCode();
    this.getCommonCodeTree();
  }

  getCommonCodeTree(): void {
    this.tree().getCommonCodeHierarchy(this.systeTypeCode);
    this.form().getCommonCodeHierarchy(this.systeTypeCode);
    this.selectedCode = '';
  }

  newForm(): void {
    this.form().newForm(this.systeTypeCode, this.selectedCode);
  }

  saveCommonCode(): void {
    this.form().save();
  }

  deleteCommonCode(): void {
    this.form().remove();
  }

  selectedItem(item: any): void {
    this.selectedCode = item.id;
    this.form().get(item.systemTypeCode, item.id);
  }

  getSystemTypeCode(): void {
    this.commonCodeService
      .getSystemTypeList()
      .subscribe(
        (model: ResponseList<SystemTypeEnum>) => {
          this.systemTypeCodeList = model.data;
        }
      );
  }

}
