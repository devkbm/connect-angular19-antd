import { Component, OnInit, AfterViewInit, inject, input, effect, Renderer2, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SessionManager } from 'src/app/core/session-manager';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { WorkCalendar } from './work-calendar.model';
import { WorkCalendarMember } from './work-calendar-member.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { NzInputNgxColorsComponent } from 'src/app/third-party/ngx-colors/nz-input-ngx-colors.component';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';


@Component({
  selector: 'app-work-calendar-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzFormItemCustomComponent,
    NzInputSelectComponent,
    NzInputNgxColorsComponent,
  ],
  template: `
    {{fg.getRawValue() | json}}
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

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="workCalendarId" label="CALEDNAR ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="workCalendarId" formControlName="workCalendarId" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="workCalendarName" label="CALENDAR NAME" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="workCalendarName" formControlName="workCalendarName" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="color" label="색상">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-ngx-colors formControlName="color"
                [itemId]="'color'"
                [colorPalette]="preset_colors">
              </nz-input-ngx-colors>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="memberList" label="팀원" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="memberList" itemId="memberList"
                [options]="memberList" [opt_value]="'userId'" [opt_label]="'name'" [mode]="'tags'"
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
export class WorkCalendarFormComponent implements OnInit, AfterViewInit {

  workGroupList: any;
  memberList: any;
  color: any;
  preset_colors = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];

  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    workCalendarId    : new FormControl<number | null>({value: null, disabled: true}, { validators: [Validators.required] }),
    workCalendarName  : new FormControl<string | null>(null, { validators: [Validators.required] }),
    color             : new FormControl<string | null>(null),
    memberList        : new FormControl<any | null>(null)
  });

  formInitId = input<number>(-1);

  constructor() {
    this.getAllMember();

    effect(() => {
      if ( this.formInitId() > 0 ) {
        this.get(this.formInitId());
      }
    })
  }

  ngOnInit(): void {

    this.newForm();
  }

  ngAfterViewInit(): void {
    //this.workCalendarName().focus();
  }

  focusInput() {
    this.renderer.selectRootElement('#workCalendarName').focus();
  }

  newForm(): void {
    this.fg.controls.memberList.setValue([SessionManager.getUserId()]);
    //this.fg.get('memberList')?.setValue([SessionManager.getUserId()]);
  }

  modifyForm(formData: WorkCalendar): void {
    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: number): void {
    const url =  GlobalProperty.serverUrl + `/api/grw/workcalendar/${id}`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    this.http.get<ResponseObject<WorkCalendar>>(url, options).pipe(
        //    catchError(this.handleError<ResponseObject<WorkCalendar>>('getWorkGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendar>) => {
            if (model.data) {
              this.modifyForm(model.data);
              this.color = model.data.color;
            } else {
              this.newForm();
            }
          }
        )
  }

  save(): void {
    const url =  GlobalProperty.serverUrl + `/api/grw/workcalendar`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    this.http.post<ResponseObject<WorkCalendar>>(url, this.fg.getRawValue(), options).pipe(
        //    catchError(this.handleError<ResponseObject<WorkCalendar>>('getWorkGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendar>) => {
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const id: number = this.fg.controls.workCalendarId.value!;

    const url =  GlobalProperty.serverUrl + `/api/grw/workcalendar/${id}`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    this.http.delete<ResponseObject<WorkCalendar>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<WorkCalendar>>('deleteWorkGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendar>) => {
            this.formDeleted.emit(this.fg.getRawValue());
          }
      )
  }

  getAllMember(): void {
    const url =  GlobalProperty.serverUrl + `/api/system/user`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    this.http.get<ResponseList<WorkCalendarMember>>(url, options).pipe(
        //  catchError(this.handleError<ResponseList<WorkCalendarMember>>('getMemberList', undefined))
        )
        .subscribe(
          (model: ResponseList<WorkCalendarMember>) => {
            if (model.data) {
                this.memberList = model.data;
            } else {
                this.memberList = [];
            }
        }
      )
  }

  selectColor(color: any): void {
    this.fg.get('color')?.setValue(color);
  }

}
