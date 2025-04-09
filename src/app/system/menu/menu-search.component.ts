import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-menu-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzDividerModule,
    NzPopconfirmModule,
  ],
  template: `
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
          <input type="text" [(ngModel)]="query.menuGroup.value" nz-input placeholder="input search text" (keyup.enter)="null">
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
          <input type="text" [(ngModel)]="query.menu.value" nz-input placeholder="input search text" (keyup.enter)="null">
          <ng-template #suffixIconSearch2>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </nz-input-group>
      </div>

      <div nz-col [nzSpan]="8" style="text-align: right;">
        <button nz-button (click)="null">
          <span nz-icon nzType="search"></span>메뉴그룹등록
        </button>
        <nz-divider nzType="vertical"></nz-divider>

        <button nz-button (click)="null">
          <span nz-icon nzType="form"></span>메뉴등록
        </button>
        <nz-divider nzType="vertical"></nz-divider>

        <button nz-button (click)="null">
          <span nz-icon nzType="form"></span>조회
        </button>

      </div>
    </div>
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSearchComponent {

  search = output<Object>();
  newFormMenuGroup = output<void>();
  newFormMenu = output<void>();
  //deleteForm = output<void>();

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

  btnSearchClicked() {
    let params: any = new Object();
    if ( this.query.menuGroup.value !== '') {
      params[this.query.menuGroup.key] = this.query.menuGroup.value;
    }

    this.search.emit(params);
  }

  btnNewClicked() {
    this.newFormMenuGroup.emit();
  }
}
