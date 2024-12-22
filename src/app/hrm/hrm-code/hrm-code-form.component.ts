import { Component, OnInit, AfterViewInit, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HrmCodeService } from './hrm-code.service';
import { HrmCode } from './hrm-code.model';
import { existingHrmTypeDetailCodeValidator } from './hrm-code-duplication-validator';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';

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

      <!-- 3 row -->
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

      <!-- 4 row -->
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

      <!-- 5 row -->
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

    </form>
  `,
  styles: []
})
export class HrmTypeCodeFormComponent implements OnInit, AfterViewInit {

  private service = inject(HrmCodeService);
  private appAlarmService = inject(AppAlarmService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    typeId        : new FormControl<string | null>(null, { validators: Validators.required }),
    code          : new FormControl<string | null>(null, {
                                    validators: Validators.required,
                                    asyncValidators: [existingHrmTypeDetailCodeValidator(this.service)],
                                    updateOn: 'blur'
                                  }),
    codeName      : new FormControl<string | null>(null, { validators: Validators.required }),
    useYn         : new FormControl<boolean | null>(true),
    sequence      : new FormControl<number | null>(0),
    comment       : new FormControl<string | null>(null),
    the1AddInfo   : new FormControl<string | null>(null),
    the2AddInfo   : new FormControl<string | null>(null),
    the3AddInfo   : new FormControl<string | null>(null),
    the4AddInfo   : new FormControl<string | null>(null),
    the5AddInfo   : new FormControl<string | null>(null)
  });

  initLoadId = input<{typeId: string, code: string}>();

  constructor() {
    effect(() => {
      if (this.initLoadId()) {
        if (this.initLoadId()?.typeId && this.initLoadId()?.code) {
          this.get(this.initLoadId()?.typeId!, this.initLoadId()?.code!);
        } else if (this.initLoadId()?.typeId) {
          this.newForm(this.initLoadId()?.typeId!);
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
    this.service
        .get(typeId, code)
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            if ( model.data ) {
              this.modifyForm(model.data);
            } else {
              this.newForm('');
            }
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  save(): void {
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .remove(this.fg.controls.typeId.value!, this.fg.controls.code.value!)
        .subscribe(
          (model: ResponseObject<HrmCode>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

}

