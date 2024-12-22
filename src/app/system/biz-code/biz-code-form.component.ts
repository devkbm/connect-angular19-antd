import { Component, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { BizCodeService } from './biz-code.service';
import { BizCode } from './biz-code.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormItemCustomComponent } from "src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component";

@Component({
  selector: 'app-biz-code-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzInputNumberModule,
    NzFormItemCustomComponent
],
  template: `
    {{fg.getRawValue() | json}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="typeId" label="업무코드분류ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeId" formControlName="typeId" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="code" label="코드" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="code" formControlName="code" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="codeName" label="코드명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="codeName" formControlName="codeName" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="useYn" label="사용여부" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <label nz-checkbox nzId="useYn" formControlName="useYn"></label>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="sequence" label="순번" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="비고">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="비고를 입력해주세요." [rows]="20">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class BizCodeFormComponent implements AfterViewInit {

  private service = inject(BizCodeService);
  private appAlarmService = inject(AppAlarmService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    typeId      : new FormControl<string | null>(null, { validators: [Validators.required] }),
    code        : new FormControl<string | null>(null, { validators: [Validators.required] }),
    codeName    : new FormControl<string | null>(null),
    useYn       : new FormControl<boolean | null>(null),
    sequence    : new FormControl<number | null>(null),
    comment     : new FormControl<string | null>(null)
  });

  formInitId = input<{typeId: string, code: string}>();

  constructor() {

    effect(() => {
      if (this.formInitId()) {
        if (this.formInitId()?.typeId && this.formInitId()?.code) {
          this.get(this.formInitId()?.typeId!, this.formInitId()?.code!);
        } else if (this.formInitId()?.typeId) {
          this.newForm(this.formInitId()?.typeId!);
        }
      }
    });
  }

  ngAfterViewInit(): void {
  }

  focusInput() {
    this.renderer.selectRootElement('#code').focus();
  }

  newForm(typeId: string): void {
    this.fg.controls.typeId.setValue(typeId);
    this.fg.controls.code.enable();
    this.fg.controls.useYn.setValue(true);

    this.focusInput();
  }

  modifyForm(formData: BizCode): void {
    this.fg.controls.code.disable();
    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(typeId: string, code: string): void {
    this.service
        .get(typeId, code)
        .subscribe(
          (model: ResponseObject<BizCode>) => {
            model.data ? this.modifyForm(model.data) : this.newForm(typeId)
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save(): void {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<BizCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    this.service
        .delete(this.fg.controls.typeId.value!, this.fg.controls.code.value!)
        .subscribe(
          (model: ResponseObject<BizCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

}
