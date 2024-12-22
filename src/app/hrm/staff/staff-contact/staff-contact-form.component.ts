import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, inject, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { StaffContactService } from './staff-contact.service';
import { StaffContact } from './staff-contact.model';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { NzListRoadAddressComponent } from 'src/app/third-party/ng-zorro/nz-list-road-address/nz-list-road-address.component';

@Component({
  selector: 'app-staff-contact-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDividerModule,
    NzListRoadAddressComponent,
    NzCrudButtonGroupComponent,
    NzFormItemCustomComponent,
  ],
  template: `
    <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        [deleteVisible]="false"
        (closeClick)="closeForm()"
        (saveClick)="save()">
    </app-nz-crud-button-group>

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
        <div nz-col nzSpan="2">
          <nz-form-item-custom for="contact_homePostNumber" label="우편번호">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_homePostNumber" formControlName="homePostNumber"
                placeholder="우편번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="contact_homeMainAddress" label="기본주소">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_homeMainAddress" formControlName="homeMainAddress"
                placeholder="기본주소를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="10">
          <nz-form-item-custom for="contact_homeSubAddress" label="상세주소">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_homeSubAddress" formControlName="homeSubAddress"
                placeholder="상세주소를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="contact_extensionNumber" label="내선번호">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_extensionNumber" formControlName="extensionNumber"
                placeholder="내선번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="contact_mobileNumber" label="휴대번호">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="contact_mobileNumber" formControlName="mobileNumber"
                placeholder="휴대번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>

    <nz-divider nzText="주소 검색"></nz-divider>

    <app-nz-list-road-address
      [height]="'300px'"
      [countPerPage]="5"
      (itemClicked)="changeRoadAddress($event)">
    </app-nz-list-road-address>

  `,
  styles: [`
    .footer {
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      padding: 10px 16px;
      border-top: 1px solid rgb(232, 232, 232);
      text-align: right;
      /*background-color: black;*/
    }
  `]
})
export class StaffContactFormComponent implements OnInit, AfterViewInit, OnChanges {

  private service = inject(StaffContactService);
  private appAlarmService = inject(AppAlarmService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    //staffId           : new FormControl<string | null>(null, { validators: Validators.required }),
    staffNo           : new FormControl<string | null>(null, { validators: Validators.required }),
    staffName         : new FormControl<string | null>(null, { validators: Validators.required }),
    homeAddressType   : new FormControl<string | null>(null, { validators: Validators.required }),
    homePostNumber    : new FormControl<string | null>(null, { validators: Validators.required }),
    homeMainAddress   : new FormControl<string | null>(null),
    homeSubAddress    : new FormControl<string | null>(null),
    extensionNumber   : new FormControl<string | null>(null),
    mobileNumber      : new FormControl<string | null>(null)
  });

  //@Input() staff?: {companyCode: string, staffNo: string, staffName: string};
  initLoadId = input<{staffId: string, seq: string}>();
  staff = input<{companyCode: string, staffNo: string, staffName: string}>();

  constructor() {
    effect(() => {
      if (this.staff()) {
        this.get(this.staff()?.staffNo!);
      } else {
        this.newForm();
      }
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    /*
    if (changes['staff'].currentValue) {
      this.get(changes['staff'].currentValue.staffNo);
    }
      */
  }

  ngOnInit() {
    /*
    if (this.initLoadId) {
      this.get(this.initLoadId);
    } else {
      this.newForm();
    }
    */
  }

  ngAfterViewInit(): void {

  }

  newForm() {
    this.fg.controls.homePostNumber.disable();
    this.fg.controls.homeMainAddress.disable();

    if (this.staff) {
      //this.fg.controls.staffId.setValue(this.staff?.staffId);
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }
  }


  modifyForm(formData: StaffContact) {
    this.fg.controls.homePostNumber.disable();
    this.fg.controls.homeMainAddress.disable();

    if (this.staff) {
      //this.fg.controls.staffId.setValue(this.staff?.staffId);
      this.fg.controls.staffNo.setValue(this.staff()?.staffNo!);
      this.fg.controls.staffName.setValue(this.staff()?.staffName!);
    }

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(staffId: string): void {
    this.service
        .get(staffId)
        .subscribe(
          (model: ResponseObject<StaffContact>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  save() {
    this.service
        .save(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<StaffContact>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  // {roadAddress: string, zipNo: string}
  changeRoadAddress(item: any) {
    this.fg.get('homeMainAddress')?.setValue(item.roadAddress);
    this.fg.get('homePostNumber')?.setValue(item.zipNo);
    this.fg.get('homeSubAddress')?.setValue(null);
  }

}
