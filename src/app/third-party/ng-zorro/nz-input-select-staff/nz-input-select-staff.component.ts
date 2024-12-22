import { Self, Optional, Component, Input, OnInit, input, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';
import { Staff, NzInputSelectStaffService } from './nz-input-select-staff.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModeType, NzSelectModule } from 'ng-zorro-antd/select';

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

  private service = inject(NzInputSelectStaffService);

  constructor(@Self()  @Optional() private ngControl: NgControl) {
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

    this.service
         .getList(params)
         .subscribe(
          (model: ResponseList<Staff>) => {
            this._list = model.data;
          }
      );
  }
}
