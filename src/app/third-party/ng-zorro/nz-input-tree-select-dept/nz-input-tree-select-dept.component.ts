import { Component, inject, input, model, OnInit, Optional, Self, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { ResponseList } from 'src/app/core/model/response-list';
import { NzInputTreeSelectDept } from './nz-input-tree-select-dept.model';
import { NzInputTreeSelectService } from './nz-input-tree-select-dept.service';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'nz-input-tree-select-dept',
  imports: [FormsModule, NzFormModule, NzTreeSelectModule],
  template: `
    <nz-tree-select
        [nzId]="itemId()"
        [ngModel]="_value()"
        [nzNodes]="nodes()"
        [nzDisabled]="_disabled"
        [nzPlaceHolder]="placeholder()"
        (blur)="onTouched()"
        (ngModelChange)="onChange($event)">
    </nz-tree-select>
  `,
  styles: []
})
export class NzInputTreeSelectDeptComponent implements ControlValueAccessor, OnInit {

  itemId = input<string>('');
  required = input<boolean | string>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  nodes = signal<NzTreeNodeOptions[] | NzTreeNode[] | NzInputTreeSelectDept[]>([]);

  _disabled = false;
  _value = model<string>();

  onChange!: (value: string) => void;
  onTouched!: () => void;

  private deptService = inject(NzInputTreeSelectService);

  constructor(@Self()  @Optional() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.getDeptHierarchy();
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

  getDeptHierarchy(): void {
    this.deptService
        .getDeptHierarchyList()
        .subscribe(
          (model: ResponseList<NzInputTreeSelectDept>) => {
            if (model.data) {
              this.nodes.set(model.data);
            } else {
              this.nodes.set([]);
            }
          }
        );
  }
}
