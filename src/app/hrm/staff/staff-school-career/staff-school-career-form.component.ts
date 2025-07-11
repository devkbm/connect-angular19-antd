import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { StaffSchoolCareer } from './staff-school-career.model';
import { ResponseList } from 'src/app/core/model/response-list';

import { HrmCode } from '../../hrm-code/hrm-code.model';
import { HrmCodeService } from '../../shared/hrm-code.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';


@Component({
  selector: 'app-staff-school-career-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzFormItemCustomComponent,
    NzInputSelectComponent
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

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <nz-form-item-custom for="schoolCareerType" label="학력" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="schoolCareerType" itemId="schoolCareerType"
                [options]="schoolCareerTypeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="schoolCode" label="학교" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="schoolCode" itemId="schoolCode"
                [options]="schoolCodeList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="fromDate" label="시작일">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="fromDate" formControlName="fromDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="toDate" label="종료일">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="toDate" formControlName="toDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <nz-form-item-custom for="majorName" label="전공">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="majorName" formControlName="majorName"
                placeholder="전공을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="pluralMajorName" label="부전공">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="pluralMajorName" formControlName="pluralMajorName"
                placeholder="부전공을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="location" label="지역">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="location" formControlName="location"
                placeholder="지역을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="lessonYear" label="수업년한">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="lessonYear" formControlName="lessonYear"
                [nzMin]="0" [nzMax]="9999">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 4 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="comment" label="비고">
            <nz-form-control>
              <textarea nz-input id="comment" formControlName="comment"
                placeholder="비고를 입력해주세요." [rows]="23">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>

<!--
    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        [deleteVisible]="true"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove(fg.controls.staffNo.value!, fg.controls.seq.value!)">
      </app-nz-crud-button-group>
    </div>
      -->
  `,
  styles: []
})
export class StaffSchoolCareerFormComponent implements OnInit, AfterViewInit, OnChanges {

  /**
   * 학력 - HR0009
   */
  schoolCareerTypeList: HrmCode[] = [];
  /**
   * 학교 - HR0010
   */
  schoolCodeList: HrmCode[] = [];

  private hrmCodeService = inject(HrmCodeService);
  private notifyService = inject(NotifyService);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    staffNo             : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName           : new FormControl<string | null>(null, { validators: Validators.required }),
    seq                 : new FormControl<string | null>(null),
    schoolCareerType    : new FormControl<string | null>(null, { validators: Validators.required }),
    schoolCode          : new FormControl<string | null>(null, { validators: Validators.required }),
    fromDate            : new FormControl<Date | null>(null, { validators: Validators.required }),
    toDate              : new FormControl<Date | null>(null),
    majorName           : new FormControl<string | null>(null),
    pluralMajorName     : new FormControl<string | null>(null),
    location            : new FormControl<string | null>(null),
    lessonYear          : new FormControl<number | null>(null),
    comment             : new FormControl<string | null>(null)
  });

  //@Input() staff?: {companyCode: string, staffNo: string, staffName: string};
  formDataId = input<{staffId: string, seq: string}>();
  staff = input<{companyCode: string, staffNo: string, staffName: string}>();

  constructor()  {
    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId()?.staffId!, this.formDataId()?.seq!);
      } else {
        this.newForm();
      }
    })
  }

  ngOnInit() {
    this.getSchoolCareerTypeList();
    this.getSchoolCodeList();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm() {
    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }
  }


  modifyForm(formData: StaffSchoolCareer) {
    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }

    //this.fg.get('database')?.disable();
    //this.fg.get('domainName')?.disable();

    this.fg.patchValue(formData);
  }


  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${staffId}/schoolcareer/${seq}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<StaffSchoolCareer>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffSchoolCareer>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffSchoolCareer>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
          }
        )
  }

  save() {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/schoolcareer`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<StaffSchoolCareer>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<StaffSchoolCareer>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffSchoolCareer>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/hrm/staff/${this.fg.controls.staffNo.value}/schoolcareer/${this.fg.controls.seq.value}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<StaffSchoolCareer>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<StaffSchoolCareer>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<StaffSchoolCareer>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )
  }

  getSchoolCareerTypeList() {
    const params = {
      typeId : 'HR0009'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.schoolCareerTypeList = model.data;
          }
      );
  }

  getSchoolCodeList() {
    const params = {
      typeId : 'HR0010'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.schoolCodeList = model.data;
          }
      );
  }

}
