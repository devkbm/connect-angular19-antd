import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffFamilyService } from './staff-family.service';
import { StaffFamily } from './staff-family.model';
import { HrmCodeService } from '../../hrm-code/hrm-code.service';
import { HrmCode } from '../../hrm-code/hrm-code.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';

@Component({
  selector: 'app-staff-family-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzFormItemCustomComponent,
    NzCrudButtonGroupComponent,
    NzInputSelectComponent,
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
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="familyRelation" label="가족관계" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="familyRelation" itemId="familyRelation"
                [options]="familyRelationList" [opt_value]="'code'" [opt_label]="'codeName'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="familyName" label="가족명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="familyName" formControlName="familyName" required
                placeholder="가족명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="familyRRN" label="주민등록번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="familyRRN" formControlName="familyRRN" required
                placeholder="가족 주민번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="occupation" label="직업">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="occupation" formControlName="occupation"
                placeholder="직업을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="schoolCareerType" label="학력">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="schoolCareerType" formControlName="schoolCareerType"
                placeholder="학력을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

        <!-- 4 Row -->
        <div nz-row nzGutter="8">
          <div nz-col nzSpan="24">
            <nz-form-item-custom for="comment" label="비고">
              <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
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
export class StaffFamilyFormComponent implements OnInit, AfterViewInit, OnChanges {

  /**
   * 가족관계 - HR0008
   */
  familyRelationList: HrmCode[] = [];

  service = inject(StaffFamilyService);
  hrmCodeService = inject(HrmCodeService);
  appAlarmService = inject(AppAlarmService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    staffNo             : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName           : new FormControl<string | null>(null, { validators: Validators.required }),
    seq                 : new FormControl<string | null>(null),
    familyName          : new FormControl<string | null>(null, { validators: Validators.required }),
    familyRRN           : new FormControl<string | null>(null, { validators: Validators.required }),
    familyRelation      : new FormControl<string | null>(null, { validators: Validators.required }),
    occupation          : new FormControl<string | null>(null),
    schoolCareerType    : new FormControl<string | null>(null),
    comment             : new FormControl<string | null>(null)
  });

  //@Input() staff?: {companyCode: string, staffNo: string, staffName: string};
  initLoadId = input<{staffId: string, seq: string}>();
  staff = input<{companyCode: string, staffNo: string, staffName: string}>();

  constructor() {
    effect(() => {
      if (this.initLoadId()) {
        this.get(this.initLoadId()?.staffId!, this.initLoadId()?.seq!);
      } else {
        this.newForm();
      }
    })
  }

  ngOnInit() {
    this.getFamilyRelationList();

    /*
    if (this.initLoadId) {
      this.get(this.initLoadId.staffId, this.initLoadId.seq);
    } else {
      this.newForm();
    }
      */
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm() {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff()) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }
  }


  modifyForm(formData: StaffFamily) {
    this.fg.controls.staffNo.disable();
    this.fg.controls.staffName.disable();

    if (this.staff) {
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }

    this.fg.patchValue(formData);
  }


  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string, seq: string): void {
    this.service
        .get(staffId, seq)
        .subscribe(
          (model: ResponseObject<StaffFamily>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save() {
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<StaffFamily>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  remove(): void {
    this.service
        .delete(this.fg.controls.staffNo.value!, this.fg.controls.seq.value!)
        .subscribe(
          (model: ResponseObject<StaffFamily>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  getFamilyRelationList() {
    const params = {
      typeId : 'HR0008'
    };

    this.hrmCodeService
        .getList(params)
        .subscribe(
          (model: ResponseList<HrmCode>) => {
            this.familyRelationList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
      );
  }

}
