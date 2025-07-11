import { Component, Input, OnInit, input, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModeType, NzSelectModule } from 'ng-zorro-antd/select';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface Staff {
  staffId: string;
  companyCode: string;
  staffNo: string;
  name: string;
  nameEng: string;
  nameChi: string;
  residentRegistrationNumber: string;
  gender: string;
  birthday: Date;
  imagePath: string;

  [key:string]:any;
}

@Component({
  selector: 'nz-input-select-staff',
  imports: [CommonModule, FormsModule, NzFormModule, NzSelectModule],
  template: `
    <nz-select
        [nzId]="itemId()"
        [ngModel]="_value()"
        [nzDisabled]="_disabled"
        [nzPlaceHolder]="placeholder()"
        [nzMode]="mode()"
        nzShowSearch
        (blur)="onTouched()"
        (ngModelChange)="onChange($event)">
        @for (option of _list; track option[opt_value()]) {
          <nz-option
            [nzLabel]="custom_label ? custom_label(option, $index) : option[opt_label()]"
            [nzValue]="option[opt_value()]">
          </nz-option>
        }
      </nz-select>
  `,
  styles: []
})
export class NzInputSelectStaffComponent implements ControlValueAccessor, OnInit {

  itemId = input<string>('');
  required = input<boolean | string>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  mode = input<NzSelectModeType>('default');
  options = input<any[]>();
  opt_label = input<string>('name');
  opt_value = input<string>('staffNo');

  @Input() custom_label?: (option: any, index: number) => {};

  onChange!: (value: string) => void;
  onTouched!: () => void;

  _list: Staff[] = [];

  _disabled = false;
  _value = model();

  private http = inject(HttpClient);

  private ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.getStaffList();
  }

  writeValue(obj: any): void {
    this._value.set(obj);
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

  getStaffList(): void {
    const params = {isEnabled: true};

    const url = GlobalProperty.serverUrl() + `/api/hrm/staff`;
    const options = getHttpOptions({isEnabled: true});

    this.http.get<ResponseList<Staff>>(url, options).pipe(
          //catchError(this.handleError<ResponseList<Staff>>('getList', undefined))
        )
        .subscribe(
          (model: ResponseList<Staff>) => {
            this._list = model.data;
          }
        );
  }
}
