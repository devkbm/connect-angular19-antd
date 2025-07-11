import { Component, input, model, inject } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModeType, NzSelectModule } from 'ng-zorro-antd/select';

import { ResponseList } from 'src/app/core/model/response-list';

import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface NzInputSelectDeptModel {
  deptId: string;
  deptCode: string;
  parentDeptCode: string;
  deptNameKorean: string;
  deptAbbreviationKorean: string;
  deptNameEnglish: string;
  deptAbbreviationEnglish: string;
  fromDate: Date;
  toDate: Date;
  seq: number;
  comment: string;
  [key:string]:any;
}

@Component({
  selector: 'nz-input-select-dept',
  imports: [FormsModule, NzFormModule, NzSelectModule],
  template: `
    <nz-select
      [nzId]="itemId()"
      [(ngModel)]="value"
      (blur)="onTouched()"
      [nzDisabled]="disabled()"
      [nzPlaceHolder]="placeholder()"
      [nzMode]="mode()"
      nzShowSearch>
      @for (option of deptList; track option[opt_value()]) {
        <nz-option
          [nzLabel]="option[opt_label()]"
          [nzValue]="option[opt_value()]">
        </nz-option>
      }
    </nz-select>
  `,
  styles: []
})
export class NzInputSelectDeptComponent implements ControlValueAccessor {

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  opt_label = input<string>('deptNameKorean');
  opt_value = input<'deptId' | 'deptCode'>('deptCode');
  mode = input<NzSelectModeType>('default');

  onChange!: (value: string) => void;
  onTouched!: () => void;

  _disabled = false;
  value = model();

  deptList: NzInputSelectDeptModel[] = [];

  private http = inject(HttpClient);

  private ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.getDeptList();
  }

  writeValue(obj: any): void {
    this.value.set(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  getDeptList(): void {
    const params = {isEnabled: true};

    const url = GlobalProperty.serverUrl() + `/api/system/dept`;
    const options = getHttpOptions(params);

    this.http.get<ResponseList<NzInputSelectDeptModel>>(url, options).pipe(
        //  catchError(this.handleError<ResponseList<NzInputSelectDeptModel>>('getDeptList', undefined))
        )
        .subscribe(
          (model: ResponseList<NzInputSelectDeptModel>) => {
            this.deptList = model.data;
          }
        )
  }

}
