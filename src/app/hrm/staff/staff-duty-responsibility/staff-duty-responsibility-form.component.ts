import { Component, OnInit, AfterViewInit, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HrmCode } from '../../hrm-code/hrm-code.model';
import { HrmCodeService } from '../../hrm-code/hrm-code.service';
import { StaffDutyResponsibility } from './staff-duty-responsibility.model';
import { StaffDutyResponsibilityService } from './staff-duty-responsibility.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';

@Component({
  selector: 'app-staff-duty-responsibility-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzFormItemCustomComponent,
    NzInputSelectComponent,
    NzCrudButtonGroupComponent,
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
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
          <nz-form-item-custom for="duty_staffNo" label="직원번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="duty_staffNo" formControlName="staffNo" required
                placeholder="직원번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="duty_staffName" label="직원명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="duty_staffName" formControlName="staffName" required
                placeholder="직원명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="4">
          <nz-form-item-custom for="seq" label="순번" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="seq" formControlName="seq" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="dutyResponsibilityCode" label="직책" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="dutyResponsibilityCode" itemId="dutyResponsibilityCode"
                [options]="dutyResponsibilityCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="fromDate" label="시작일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="fromDate" formControlName="fromDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="toDate" label="종료일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="toDate" formControlName="toDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="2">
          <nz-form-item-custom for="isPayApply" label="급여적용">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <label nz-checkbox nzId="isPayApply" formControlName="isPayApply"></label>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>
    </form>
  `,
  styles: []
})
export class StaffDutyResponsibilityFormComponent implements OnInit, AfterViewInit {

  /**
   * 직책코드 - HR0007
   */
  dutyResponsibilityCodeList: HrmCode[] = [];

  service = inject(StaffDutyResponsibilityService);
  hrmCodeService = inject(HrmCodeService);
  appAlarmService = inject(AppAlarmService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
      staffNo                 : new FormControl<string | null>(null, { validators: Validators.required }),
      staffName               : new FormControl<string | null>(null),
      seq                     : new FormControl<string | null>({value: null, disabled: true}, { validators: [Validators.required] }),
      dutyResponsibilityCode  : new FormControl<string | null>(null),
      dutyResponsibilityName  : new FormControl<string | null>(null),
      fromDate                : new FormControl<Date | null>(null),
      toDate                  : new FormControl<Date | null>(null),
      isPayApply              : new FormControl<boolean | null>(null)
    });

    formInitId = input<{staffId: string, seq: string}>();
  staff = input<{companyCode: string, staffNo: string, staffName: string}>();

  constructor() {
    effect(() => {
      if (this.formInitId()) {
        this.get(this.formInitId()?.staffId!, this.formInitId()?.seq!);
      } else {
        this.newForm();
      }
    })
  }

  ngOnInit(): void {
    this.getHrmTypeDetailCodeList('HR0007', "dutyResponsibilityCodeList");
  }

  ngAfterViewInit(): void {
  }


  newForm(): void {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }
  }

  modifyForm(formData: StaffDutyResponsibility): void {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();
    this.fg.controls.seq.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {
    this.service
        .get(staffId, seq)
        .subscribe(
          (model: ResponseObject<StaffDutyResponsibility>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
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
          (model: ResponseObject<StaffDutyResponsibility>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(typeCode: string, detailCode: string): void {
    /*
    this.service
        .delete(typeCode, detailCode)
        .subscribe(
          (model: ResponseObject<StaffDutyResponsibility>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
    */
  }


  getHrmTypeDetailCodeList(typeId: string, propertyName: string): void {
    const params = {
      typeId : typeId
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.dutyResponsibilityCodeList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
      );

  }
}
