import { Component, inject, Input, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';

import { NzSelectModeType, NzSelectModule } from 'ng-zorro-antd/select';

export interface HtmlSelectOption {
  label: string;
  value: string | number;
  [key: string]: any;
}

@Component({
  selector: 'nz-input-select',
  imports: [FormsModule, NzSelectModule],
  template: `
    <nz-select
      [nzId]="itemId()"
      [(ngModel)]="_value"
      [nzDisabled]="_disabled"
      [nzPlaceHolder]="placeholder()"
      [nzMode]="mode()"
      nzShowSearch
      (blur)="onTouched()"
      (ngModelChange)="onChange($event)">
    @for (option of options(); track option[opt_value()]) {
      <nz-option
        [nzLabel]="custom_label ? custom_label(option, $index) : option[opt_label()]"
        [nzValue]="option[opt_value()]">
      </nz-option>
    }
    </nz-select>
  `,
  styles: `
  `
})
export class NzInputSelectComponent implements ControlValueAccessor {

  itemId = input<string>('');
  required = input<boolean | string>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  mode = input<NzSelectModeType>('default');
  options = input<any[]>();
  opt_label = input<string>('label');
  opt_value = input<string>('value');
  @Input() custom_label?: (option: any, index: number) => {};

  _disabled = false;
  _value: any | any[];

  onChange!: (value: string) => void;
  onTouched!: () => void;

  private ngControl = inject(NgControl, { self: true, optional: true });
  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
}
