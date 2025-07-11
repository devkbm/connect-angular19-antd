import { Component, input, model, inject, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectComponent, NzSelectModeType, NzSelectModule } from 'ng-zorro-antd/select';

import { ResponseList } from 'src/app/core/model/response-list';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface CompanyModel {
  companyCode: string;
  companyName: string;
  businessRegistrationNumber: string;
  coporationNumber: string;
  nameOfRepresentative: string;
  establishmentDate: Date;
  [key:string]:any;
}

@Component({
  selector: 'app-nz-input-select-company',
  imports: [
    FormsModule, NzFormModule, NzSelectModule
  ],
  template: `
   <!--{{value()}}-->
   <nz-select
      [nzId]="itemId()"
      [(ngModel)]="value"
      (blur)="onTouched()"
      [nzDisabled]="disabled()"
      [nzPlaceHolder]="placeholder()"
      [nzMode]="mode()"
      nzShowSearch
      >
      @for (option of _list; track option[opt_value()]) {
        <nz-option
          [nzLabel]="option[opt_label()]"
          [nzValue]="option[opt_value()]">
        </nz-option>
      }
    </nz-select>
  `,
  styles: `
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NzInputSelectCompanyComponent implements ControlValueAccessor {

  itemId = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  opt_label = input<string>('companyName');
  opt_value = input<string>('companyCode');
  mode = input<NzSelectModeType>('default');

  select = viewChild.required(NzSelectComponent);

  onChange!: (value: any) => {};
  onTouched!: () => {};

  _disabled = false;
  value = model<string | null>(null);

  _list: CompanyModel[] = [];

  private http = inject(HttpClient);

  private ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.getCompanyList();
  }

  writeValue(obj: any): void {
    this.value = obj;
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

  getCompanyList(): void {
    const params = {isEnabled: true};

    const url = GlobalProperty.serverUrl() + `/api/system/company`;
    const options = getHttpOptions(params);

    this.http.get<ResponseList<CompanyModel>>(url, options).pipe(
        //  catchError(this.handleError<ResponseList<NzInputSelectDeptModel>>('getDeptList', undefined))
        )
        .subscribe(
          (model: ResponseList<CompanyModel>) => {
            this._list = model.data;

            this.value.set(this._list[0].companyCode);
          }
        )
  }

}
