import { Component, OnInit, Input, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseMap } from 'src/app/core/model/response-map';

import { StaffAppointmentRecord } from './staff-appointment-record.model';
import { HrmCode } from '../../hrm-code/hrm-code.model';
import { HrmCodeService } from '../../shared/hrm-code.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { NzInputTreeSelectDeptComponent } from 'src/app/third-party/ng-zorro/nz-input-tree-select-dept/nz-input-tree-select-dept.component';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';


@Component({
  selector: 'app-staff-appointment-record-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzDividerModule,
    NzInputTreeSelectDeptComponent,
    NzFormItemCustomComponent,
    NzInputSelectComponent,
  ],
  template: `
    {{fg.value | json}}
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
          <nz-form-item-custom for="staffNo" label="직원번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="staffNo" formControlName="staffNo" required
                placeholder="직원번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="staffName" label="직원명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="staffName" formControlName="staffName" required
                placeholder="직원명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">

        <div nz-col nzSpan="4">
          <nz-form-item-custom for="seq" label="발령순번">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="seq" formControlName="seq" readonly
                placeholder="신규"/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item-custom for="appointmentTypeCode" label="발령분류" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="appointmentTypeCode" itemId="appointmentTypeCode"
                [options]="appointmentTypeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item-custom for="applyType" label="적용구분" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="applyType" itemId="applyType"
                [options]="applyTypeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="appointmentDate" label="발령일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="appointmentDate" formControlName="appointmentDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="appointmentEndDate" label="발령종료일">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="appointmentEndDate" formControlName="appointmentEndDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="recordName" label="발령내용" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="recordName" formControlName="recordName" required
                placeholder="발령내용을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="comment" label="비고" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="comment" formControlName="comment" required
                placeholder="비고내용을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <nz-divider nzPlain nzText="발령 내역" nzOrientation="center"></nz-divider>
      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="blngDeptCode" label="소속부서" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-tree-select-dept itemId="blngDeptCode" formControlName="blngDeptCode" required>
              </nz-input-tree-select-dept>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="workDeptCode" label="근무부서" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-tree-select-dept itemId="workDeptCode" formControlName="workDeptCode" required>
              </nz-input-tree-select-dept>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="dutyResponsibilityCode" label="직책">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select
                formControlName="dutyResponsibilityCode" itemId="dutyResponsibilityCode"
                [options]="dutyResponsibilityCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>


      <!-- 5 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="jobGroupCode" label="직군" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="jobGroupCode" itemId="jobGroupCode"
                [options]="groupJobCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="jobPositionCode" label="직위" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="jobPositionCode" itemId="jobPositionCode"
                [options]="jobPositionCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="jobCode" label="직무" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="jobCode" itemId="jobCode"
                [options]="jobCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 6 row-->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="occupationCode" label="직종" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="occupationCode" itemId="occupationCode"
                [options]="occupationCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="jobGradeCode" label="직급" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="jobGradeCode" itemId="jobGradeCode"
                [options]="jobGradeCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="payStepCode" label="호봉" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="payStepCode" itemId="payStepCode"
                [options]="payStepCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class StaffAppointmentRecordFormComponent implements OnInit {

  bizTypeList = [{code:'code', name:'name'},{code:'code2', name:'name2'}];

  applyTypeList = [{code:'10', codeName:'예약적용'},{code:'02', codeName:'즉시적용'}];

  /**
   * https://soopdop.github.io/2020/12/01/index-signatures-in-typescript/
   * string literal로 접근하기위한 변수
   */
  [key: string]: any;

  /**
   * 발령분류코드 - HR0000
   */
  appointmentTypeList: HrmCode[] = [];
  /**
   * 직군코드 - HR0001
   */
  groupJobCodeList: HrmCode[] = [];
  /**
   * 직위코드 - HR0002
   */
  jobPositionCodeList: HrmCode[] = [];
  /**
   * 직종코드 - HR0003
   */
  occupationCodeList: HrmCode[] = [];
  /**
   * 직급코드 - HR0004
   */
  jobGradeCodeList: HrmCode[] = [];
  /**
   * 호봉코드 - HR0005
   */
  payStepCodeList: HrmCode[] = [];
  /**
   * 직무코드 - HR0006
   */
  jobCodeList: HrmCode[] = [];
  /**
   * 직책코드 - HR0007
   */
  dutyResponsibilityCodeList: HrmCode[] = [];

  private hrmCodeService = inject(HrmCodeService);
  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
      staffNo                 : new FormControl<string | null>(null, { validators: Validators.required }),
      staffName               : new FormControl<string | null>(null),
      seq                     : new FormControl<string | null>(null),
      appointmentTypeCode     : new FormControl<string | null>(null),
      applyType               : new FormControl<string | null>(null),
      appointmentDate         : new FormControl<Date | null>(null),
      appointmentEndDate      : new FormControl<Date | null>(null),
      recordName              : new FormControl<string | null>(null),
      comment                 : new FormControl<string | null>(null),
      isCompleted             : new FormControl<boolean | null>(null),
      blngDeptCode            : new FormControl<string | null>(null),
      workDeptCode            : new FormControl<string | null>(null),
      jobGroupCode            : new FormControl<string | null>(null),
      jobPositionCode         : new FormControl<string | null>(null),
      occupationCode          : new FormControl<string | null>(null),
      jobGradeCode            : new FormControl<string | null>(null),
      payStepCode             : new FormControl<string | null>(null),
      jobCode                 : new FormControl<string | null>(null),
      dutyResponsibilityCode  : new FormControl<string | null>(null)
  });

  formDataId = input<{staffId: string, seq: string}>();
  staff = input<{companyCode: string, staffNo: string, staffName: string}>();

  constructor() {
    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()?.staffId!, this.formDataId()?.seq!);
      } else {
        this.newForm();
      }
    })
  }

  ngOnInit(): void {

    this.getCodeMap([
      {typeId: 'HR0000', propertyName: "appointmentTypeList"},
      {typeId: 'HR0001', propertyName: "groupJobCodeList"},
      {typeId: 'HR0002', propertyName: "jobPositionCodeList"},
      {typeId: 'HR0003', propertyName: "occupationCodeList"},
      {typeId: 'HR0004', propertyName: "jobGradeCodeList"},
      {typeId: 'HR0005', propertyName: "payStepCodeList"},
      {typeId: 'HR0006', propertyName: "jobCodeList"},
      {typeId: 'HR0007', propertyName: "dutyResponsibilityCodeList"}
    ]);

  }

  newForm(): void {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      //this.fg.controls.staffId.setValue(this.staff?.staffId);
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }

  }

  modifyForm(formData: StaffAppointmentRecord): void {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    //grid.getGridList(this.fg.get('staffId')?.value);
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/appointmentrecord/${id}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<StaffAppointmentRecord>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffAppointmentRecord>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
          }
        )
  }

  save(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/appointmentrecord`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<StaffAppointmentRecord>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffAppointmentRecord>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(staffId: string, id: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/appointmentrecord/${id}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<StaffAppointmentRecord>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffAppointmentRecord>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

  getCodeMap(objs: {typeId: string,  propertyName: string}[]): void {

    const params = {
      typeIds : objs.map(e => e.typeId)
    };

    this.hrmCodeService
        .getMapList(params)
        .subscribe(
          (model: ResponseMap<HrmCode>) => {
            if ( model.data ) {
              let data: any = model.data;

              for (const obj of objs) {
                this[obj.propertyName] = data[obj.typeId];
              }
            } else {
              //list = [];
            }
          }
      );

  }

}
