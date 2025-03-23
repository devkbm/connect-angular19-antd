import { Component, OnInit, AfterViewInit, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

import { HrmCode } from './hrm-code.model';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgZorroAntdModule } from '@ngx-formly/ng-zorro-antd';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { HrmCodeFormValidatorService } from './validator/hrm-code-form-validator.service';

@Component({
  selector: 'app-hrm-code-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzDividerModule,
    NzFormItemCustomComponent,
    FormlyModule,
    FormlyNgZorroAntdModule
  ],
  template: `
    {{fg.getRawValue() | json}}
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
        <div nz-col nzSpan="4">
          <nz-form-item-custom for="typeId" label="구분ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="typeId" formControlName="typeId" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item-custom for="code" label="코드" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="code" formControlName="code" required
                placeholder="코드를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="10">
        <nz-form-item-custom for="codeName" label="코드명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="codeName" formControlName="codeName" required
                placeholder="코드명를 입력해주세요."/>
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

        <div nz-col nzSpan="2">
          <nz-form-item-custom for="useYn" label="사용" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <label nz-checkbox nzId="useYn" formControlName="useYn"></label>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="설명">
            <nz-form-control>
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="설명을 입력해주세요." [rows]="10">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <formly-form [form]="this.fg.controls.extraInfo" [fields]="fields"></formly-form>

      <!--
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="the1AddInfo" label="추가정보1">
            <nz-form-control>
              <textarea nz-input id="the1AddInfo" formControlName="the1AddInfo"
                placeholder="설명을 입력해주세요." [rows]="5">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="the2AddInfo" label="추가정보2">
            <nz-form-control>
              <textarea nz-input id="the2AddInfo" formControlName="the2AddInfo"
                placeholder="설명을 입력해주세요." [rows]="5">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="the3AddInfo" label="추가정보3">
            <nz-form-control>
              <textarea nz-input id="the3AddInfo" formControlName="the3AddInfo"
                placeholder="설명을 입력해주세요." [rows]="5">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="the4AddInfo" label="추가정보4">
            <nz-form-control>
              <textarea nz-input id="the4AddInfo" formControlName="the4AddInfo"
                placeholder="설명을 입력해주세요." [rows]="5">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="the5AddInfo" label="추가정보5">
            <nz-form-control>
              <textarea nz-input id="the5AddInfo" formControlName="the5AddInfo"
                placeholder="설명을 입력해주세요." [rows]="5">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>
      -->

    </form>
  `,
  styles: []
})
export class HrmTypeCodeFormComponent implements OnInit, AfterViewInit {

  private notifyService = inject(NotifyService);
  private validator = inject(HrmCodeFormValidatorService);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    typeId        : new FormControl<string | null>({value: null, disabled: true}, { validators: Validators.required }),
    code          : new FormControl<string | null>(null, {
                                    validators: Validators.required,
                                    asyncValidators: [this.validator.existingEntityValidator()],
                                    updateOn: 'blur'
                                  }),
    codeName      : new FormControl<string | null>(null, { validators: Validators.required }),
    useYn         : new FormControl<boolean | null>(true),
    sequence      : new FormControl<number | null>(0),
    comment       : new FormControl<string | null>(null),
    extraInfo     : inject(FormBuilder).group({})
  });

  fields: FormlyFieldConfig[] = [
    /*{
      key: 'the1AddInfo',
      type: 'input',
      props: {
        label: 'Input',
        placeholder: 'Placeholder',
        description: 'Description',
      },
    },
    */
  ];

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

  ngOnInit() {

  }

  ngAfterViewInit(): void {
  }

  newForm(typeId: string): void {
    this.fg.controls.typeId.setValue(typeId);
    this.fg.controls.useYn.setValue(true);

    this.fg.controls.typeId.disable();
    this.fg.controls.code.enable();
  }

  modifyForm(formData: HrmCode): void {
    this.fg.patchValue(formData);

    this.fg.controls.code.disable();
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  select(param: any) {
    this.get(param.value['typeId'], param.value['code']);
  }

  get(typeId: string, code: string): void {
    const url = GlobalProperty.serverUrl + `/api/hrm/hrmtype/${typeId}/code/${code}`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    }

    this.http.get<ResponseObject<HrmCode>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<boolean>>('valid', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            if ( model.data ) {
              this.modifyForm(model.data);
            } else {
              this.newForm('');
            }

            const val = JSON.parse(model.data.fieldConfig!);
            this.fields = val;
            console.log(this.fields);
          }
        )
  }

  save(): void {
    const url = GlobalProperty.serverUrl + `/api/hrm/hrmtype/type/code`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    }

    this.http.post<ResponseObject<HrmCode>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<HrmCode>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl + `/api/hrm/hrmtype/${this.fg.controls.typeId.value}/code/${this.fg.controls.code.value}`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    }

    this.http.delete<ResponseObject<HrmCode>>(url, options).pipe(
          // catchError(this.handleError<ResponseObject<HrmCode>>('remove', undefined))
        )
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

}

