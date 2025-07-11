import { Component, OnInit, AfterViewInit, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';

import { HrmType } from './hrm-type.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { HrmCodeTypeFormValidatorService } from './validator/hrm-code-type-form-validator.service';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hrm-code-type-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDividerModule,
    NzFormItemCustomComponent
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="10">
          <nz-form-item-custom for="typeId" label="구분ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeId" formControlName="typeId" required
                placeholder="구분ID를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="10">
          <nz-form-item-custom for="typeName" label="구분명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeName" formControlName="typeName" required
                placeholder="구분명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item-custom for="sequence" label="출력 순번" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999"
              ></nz-input-number>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="설명">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="comment" formControlName="comment"
              placeholder="설명을 입력해주세요." [rows]="8">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="fieldConfig" label="설명">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="fieldConfig" formControlName="fieldConfig"
              placeholder="" [rows]="8">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class HrmCodeTypeFormComponent implements OnInit, AfterViewInit {

  private fb = inject(FormBuilder);
  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);
  private validator = inject(HrmCodeTypeFormValidatorService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = this.fb.group({
    typeId          : new FormControl<string | null>(null, {
                        validators: Validators.required,
                        asyncValidators: [this.validator.existingEntityValidator()],
                        updateOn: 'blur'
                      }),
    typeName        : new FormControl<string | null>(null, { validators: Validators.required }),
    sequence        : new FormControl<number | null>(0),
    comment         : new FormControl<string | null>(null),
    fieldConfig     : new FormControl<string | null>(null),
    /*
    the1AddInfoDesc : new FormControl<string | null>(null),
    the2AddInfoDesc : new FormControl<string | null>(null),
    the3AddInfoDesc : new FormControl<string | null>(null),
    the4AddInfoDesc : new FormControl<string | null>(null),
    the5AddInfoDesc : new FormControl<string | null>(null)
    */
  });

  formDataId = input<string>();

  constructor() {
    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()!);
      } else {
        this.newForm();
      }
    })
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  newForm(): void {
    this.fg.reset();
    this.fg.controls.typeId.enable();

    //this.typeId().focus();
  }

  modifyForm(formData: HrmType): void {
    this.fg.patchValue(formData);
    this.fg.controls.typeId.disable();
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  select(param: any) {
    this.get(param.value['typeId']);
  }

  get(code: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/hrmtype/${code}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<HrmType>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<HrmType>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmType>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();

            const val = JSON.parse(model.data.fieldConfig!);
            console.log(val);
          }
      )
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

    const url = GlobalProperty.serverUrl() + `/api/hrm/hrmtype`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<HrmType>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<HrmType>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmType>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const id = this.fg.controls.typeId.value!;
    const url = GlobalProperty.serverUrl() + `/api/hrm/hrmtype/${id}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<HrmType>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<HrmType>>('remove', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmType>) => {
          this.notifyService.changeMessage(model.message);
          this.formDeleted.emit(this.fg.getRawValue());
          }
      )
  }

}

