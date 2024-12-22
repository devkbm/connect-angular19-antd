import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormItemCustomComponent } from "../../third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component";

@Component({
  selector: 'app-form-test',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NzGridModule, NzFormModule, NzInputModule,
    NzFormItemCustomComponent
],
  template: `
    {{fg.getRawValue() | json}}
    <ng-template #errorTpl let-control>
      @if (control.hasError('required')) {
        필수 입력 값입니다.
      }
    </ng-template>

    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="input_text">E-mail</nz-form-label>
            <nz-form-control [nzErrorTip]="errorTpl" >
              <input nz-input id="input_text" name="input_text" formControlName="input_text"/>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="input_text2" label="input_text2" [required]="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="input_text2" formControlName="input_text2" />
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>
    </form>
  `,
  styles: `
  `
})
export class FormTestComponent {
  fg: FormGroup = inject(FormBuilder).group({
    input_text: ['test', [ Validators.required ]],
    input_text2: ['test', [ Validators.required ]],
  });
}
