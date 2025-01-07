import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { HrmCode } from '../hrm-code/hrm-code.model';
import { HrmCodeService } from '../hrm-code/hrm-code.service';
import { DutyDate, DutyApplication } from './duty-application.model';
import { DutyApplicationService } from './duty-application.service';
import { DutyDateListComponent } from './duty-date-list.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputSelectStaffComponent } from 'src/app/third-party/ng-zorro/nz-input-select-staff/nz-input-select-staff.component';

@Component({
  selector: 'app-duty-application-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzFormItemCustomComponent,
    NzDividerModule,
    NzDatePickerModule,
    NzInputSelectComponent,
    NzInputSelectStaffComponent,
    NzCrudButtonGroupComponent,
    DutyDateListComponent,
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <!-- 폼 오류 메시지 템플릿 -->
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
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="dutyId" label="근태신청ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="dutyId" formControlName="dutyId" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="staffId" label="직원">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select-staff required
                formControlName="staffId" itemId="staffId"
                placeholder="Please select">
              </nz-input-select-staff>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="dutyCode" label="근태코드" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="dutyCode" itemId="dutyCode"
                [options]="dutyCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="dutyReason" label="근태사유">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="dutyReason" formControlName="dutyReason"/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="fromDate" label="근태 시작일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="fromDate" formControlName="fromDate" [nzFormat]="'yyyy-MM-dd'">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="toDate" label="근태 종료일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="toDate" formControlName="toDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 4 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <app-duty-date-list [data]="this.fg.get('selectedDate')?.value!" [height]="'100px'">
          </app-duty-date-list>
        </div>
      </div>
    </form>


    <app-nz-crud-button-group
      [isSavePopupConfirm]="false"
      [deleteVisible]="true"
      (searchClick)="get(fg.value.dutyId!)"
      (saveClick)="save()"
      (deleteClick)="remove()"
      (closeClick)="closeForm()">
    </app-nz-crud-button-group>

    <div class="footer">
    </div>


  `,
  styles: [`
    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }
  `]
})
export class DutyApplicationFormComponent implements OnInit {

  /**
   * 근태신청분류 - HR1001
   */
  dutyCodeList: HrmCode[] = [];

  private service = inject(DutyApplicationService);
  private hrmCodeService = inject(HrmCodeService);
  private appAlarmService = inject(AppAlarmService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    dutyId            : new FormControl<string | null>(null, { validators: Validators.required }),
    staffId           : new FormControl<string | null>(null, { validators: Validators.required }),
    dutyCode          : new FormControl<string | null>(null),
    dutyReason        : new FormControl<string | null>(null),
    fromDate          : new FormControl<string | null>(null),
    toDate            : new FormControl<string | null>(null),
    selectedDate      : new FormControl<DutyDate[] | null>(null),
    dutyTime          : new FormControl<number | null>(null)
  });

  ngOnInit() {
    this.getDutyCodeList();
    this.newForm();
  }

  newForm() {
    this.fg.reset();
    this.fg.controls.staffId.enable();
    this.fg.patchValue({
      fromDate: formatDate(new Date(),'YYYY-MM-dd','ko-kr'),
      toDate: formatDate(new Date(),'YYYY-MM-dd','ko-kr'),
      dutyTime: 8
    });


    this.fg.controls.fromDate.valueChanges.subscribe(fromDate => {
      if (fromDate) {
        this.getDutyDateList(formatDate(fromDate,'YYYY-MM-dd','ko-kr'), formatDate(this.fg.controls.toDate.value!,'YYYY-MM-dd','ko-kr'));
      }
    });
    this.fg.controls.toDate.valueChanges.subscribe(toDate => {
      if (toDate) {
        this.getDutyDateList(formatDate(this.fg.controls.fromDate.value!,'YYYY-MM-dd','ko-kr'), formatDate(toDate,'YYYY-MM-dd','ko-kr'));
      }
    });

    this.getDutyDateList(formatDate(this.fg.controls.fromDate.value!,'YYYY-MM-dd','ko-kr'), formatDate(this.fg.controls.toDate.value!,'YYYY-MM-dd','ko-kr'));
  }

  modifyForm(formData: DutyApplication) {
    this.fg.patchValue(formData);
    this.fg.get('staffId')?.disable();
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<DutyApplication>) => {
            this.modifyForm(model.data);
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  save() {
    console.log('save');
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<DutyApplication>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove() {
    this.service
        .remove(this.fg.value.dutyId!)
        .subscribe(
          (model: ResponseObject<DutyApplication>) => {
            this.appAlarmService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getDutyCodeList() {
    const params = {
      typeId : 'HR1001'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.dutyCodeList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

  getDutyDateList(fromDate: string, toDate: string) {
    console.log(fromDate, toDate);

    this.service
        .getDutyDateList(fromDate, toDate)
        .subscribe(
          (model: ResponseList<DutyDate>) => {
            console.log(model.data);
            this.fg.get('selectedDate')?.setValue(model.data);
            //this.dutyCodeList = model.data;
          }
        )
  }

}
