import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, viewChild, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { StaffService } from '../staff.service';
import { NewStaff } from './new-staff-form.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputRregnoComponent } from 'src/app/third-party/ng-zorro/nz-input-rregno/nz-input-rregno.component';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';

@Component({
  selector: 'app-new-staff-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzFormItemCustomComponent,
    NzInputRregnoComponent
  ],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.valid}}
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

      <!-- 1 Row -->
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
          <nz-form-item-custom for="name" label="직원명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="name" formControlName="name" required
                placeholder="직원명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="residentRegistrationNumber" label="주민등록번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-rregno
                formControlName="residentRegistrationNumber" itemId="residentRegistrationNumber"
                placeholder="주민등록번호를 입력해주세요."
                [required]="true">
              </nz-input-rregno>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class NewStaffFormComponent implements OnInit, AfterViewInit, OnChanges {

  //staffNo = viewChild.required<NzInputTextComponent>('staffNo');

  private service = inject(StaffService);
  private appAlarmService = inject(AppAlarmService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    staffNo                     : new FormControl<string | null>(null, { validators: Validators.required }),
    name                        : new FormControl<string | null>(null, { validators: Validators.required }),
    residentRegistrationNumber  : new FormControl<string | null>(null, { validators: Validators.required }),
    nameEng                     : new FormControl<string | null>(null),
    nameChi                     : new FormControl<string | null>(null)
  });

  formInitId = input<string>('');

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.newForm('');
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  newForm(id: String) {
    //this.staffNo().focus();
  }

  /*
  modifyForm(formData: DataDomain) {
    this.formType = FormType.MODIFY;

    this.fg.get('database')?.disable();
    this.fg.get('domainName')?.disable();

    this.fg.patchValue(formData);
  }
  */

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  save() {
    this.service
        .newStaff(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<NewStaff>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

}