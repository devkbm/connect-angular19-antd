import { Component, inject, input, model } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';

import { NzTreeNodeOptions, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';


@Component({
  selector: 'nz-input-tree-select',
  imports: [FormsModule, NzFormModule, NzTreeSelectModule],
  template: `
    <nz-tree-select
      [nzId]="itemId()"
      [ngModel]="_value()"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
      [nzNodes]="nodes()"
      [nzDisabled]="disabled()"
      [nzPlaceHolder]="placeholder()"
      >
    </nz-tree-select>
  `,
  styles: `
  `
})
export class NzInputTreeSelectComponent implements ControlValueAccessor {

  itemId = input<string>('');
  required = input<boolean | string>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  nodes = input<NzTreeNodeOptions[] | NzTreeNode[] | any[]>([]);

  _disabled = false;
  _value = model();

  onChange!: (value: string) => void;
  onTouched!: () => void;

  private ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: any): void {
    this._value.set(obj);
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
