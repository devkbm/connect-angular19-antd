import { Component, Input, TemplateRef, viewChild, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgModel, NgControl, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerComponent, NzTimePickerModule } from 'ng-zorro-antd/time-picker';

import { formatDate } from '@angular/common';

export enum TimeFormat {
  HourMinuteSecond = 'HH:mm:ss',
  HourMinute = 'HH:mm'
}

@Component({
  selector: 'app-nz-input-datetime',
  imports: [FormsModule, NzFormModule, NzDatePickerModule, NzTimePickerModule],
  template: `
    <!--{{formField.errors | json}}-->
    <nz-date-picker #date
      [nzId]="itemId"
      [nzPlaceHolder]="placeholder"
      [required]="required"
      [nzDisabled]="disabled"
      [nzInputReadOnly]="readonly"
      nzAllowClear="false"
      [(ngModel)]="_value"
      (ngModelChange)="dateValueChange($event)"
      (blur)="onTouched()">
    </nz-date-picker>
    <nz-time-picker #time
      [nzDisabled]="disabled"
      [nzFormat]="timeFormat"
      [nzNowText]="' '"
      [nzMinuteStep]="30"
      [(ngModel)]="_value"
      (ngModelChange)="timeValueChange($event)">
    </nz-time-picker>
  `,
  styles:[`
    nz-date-picker {
      width: 140px
    }
    nz-time-picker {
      width: 120px
    }
  `]
})
export class NzInputDateTimeComponent implements ControlValueAccessor {

  dateElement = viewChild.required(NzDatePickerComponent);
  timeElement = viewChild.required(NzTimePickerComponent);

  @Input() itemId: string = '';
  @Input() required: boolean | string = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() readonly: boolean = false;

  @Input() timeFormat: TimeFormat = TimeFormat.HourMinuteSecond;

  @Input() nzErrorTip?: string | TemplateRef<{$implicit: AbstractControl | NgModel;}>;

  _value: any;

  onChange!: (value: string | null) => void;
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  focus(): void {
    this.dateElement()?.focus();
  }

  dateValueChange(val: Date) {
    this._value = val;
    const nativeValue = this.dateElement()?.pickerInput?.nativeElement.value as string;
    // keyboard로 8자리 숫자입력 받을 경우 Date로 변환 처리
    if (nativeValue.length === 8) {
      this._value = this.convertDate(nativeValue);
    }

    if (this._value !== null) {
      this.onChange(formatDate(this._value,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
    } else {
      this.onChange(null);
      this.focus();
    }
  }

  timeValueChange(val: any) {
    this._value = val;
    const nativeValue = this.timeElement()?.inputRef.nativeElement.value as string;
    console.log(nativeValue);

    if (this._value !== null) {
      this.onChange(formatDate(this._value,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
      //this.onChange(this._value);
    }
  }

  convertDate(dateStr: string): Date | null {
    const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    const convertValue = dateStr.replace(reg,'');

    if (dateStr.length >= 8) {
      const year = convertValue.substring(0,4);
      const month = convertValue.substring(4,6);
      const day = convertValue.substring(6,8);
      const dateStr = year + '-' + month + '-' + day;
      const dateNum = Date.parse(dateStr);
      // Validate Date String
      if (!isNaN(dateNum)) {
        return new Date(dateStr);
      }
    }

    return null;
  }

  convertTime(timeStr: string): Date | null {
    const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    const convertValue = timeStr.replace(reg,'');

    if (timeStr.length >= 8) {
      const year = convertValue.substring(0,4);
      const month = convertValue.substring(4,6);
      const day = convertValue.substring(6,8);
      const dateStr = year + '-' + month + '-' + day;
      const dateNum = Date.parse(dateStr);
      // Validate Date String
      if (!isNaN(dateNum)) {
        return new Date(dateStr);
      }
    }

    return null;
  }

}
