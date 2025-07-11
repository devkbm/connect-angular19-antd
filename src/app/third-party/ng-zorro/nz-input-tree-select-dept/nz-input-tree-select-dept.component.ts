import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { ResponseList } from 'src/app/core/model/response-list';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

export interface NzInputTreeSelectDept {
  parentDeptCode: string;
  deptCode: string;
  deptNameKorean: string;
  deptAbbreviationKorean: string;
  deptNameEnglish: string;
  deptAbbreviationEnglish: string;
  fromDate: string;
  toDate: string;
  seq: number;
  comment: string;

  title: string;
  key: string;
  isLeaf: boolean;
  children: NzInputTreeSelectDept[];
}


@Component({
  selector: 'nz-input-tree-select-dept',
  imports: [FormsModule, NzFormModule, NzTreeSelectModule],
  template: `
    <nz-tree-select
      [nzId]="itemId()"
      [ngModel]="value()"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
      [nzDisabled]="_disabled"
      [nzNodes]="nodes()"
      [nzPlaceHolder]="placeholder()"
      >
    </nz-tree-select>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NzInputTreeSelectDeptComponent implements ControlValueAccessor {

  itemId = input<string>('');
  required = input<boolean | string>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');
  nodes = signal<NzTreeNodeOptions[] | NzTreeNode[] | NzInputTreeSelectDept[]>([]);

  _disabled = false;
  value = model<string | null>(null);

  onChange!: (value: any) => void;
  onTouched!: () => void;

  private http = inject(HttpClient);
  private ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.getDeptHierarchy();
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

  getDeptHierarchy(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/depttree`;
    const options = getHttpOptions();

    this.http.get<ResponseList<NzInputTreeSelectDept>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
        )
        .subscribe(
          (model: ResponseList<NzInputTreeSelectDept>) => {
            if (model.data) {
              this.nodes.set(model.data);
            } else {
              this.nodes.set([]);
            }
          }
        )
  }

}
