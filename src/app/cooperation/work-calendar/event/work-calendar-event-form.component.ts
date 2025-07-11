import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, input, signal, effect, Renderer2, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators, ValueChangeEvent } from '@angular/forms';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { pairwise } from 'rxjs';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { NzInputDateTimeComponent, TimeFormat } from 'src/app/third-party/ng-zorro/nz-input-datetime/nz-input-datetime.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

//import { WorkCalendarEvent } from './work-calendar-event.model';


export interface WorkCalendar {
  workCalendarId: string | null;
  workCalendarName: string | null;
  color: string | null;
  memberList: string[];
}

export interface WorkCalendarEvent {
  id: string | null;
  text: string | null;
  start: string | Date | null;
  end: string | Date | null;
  allDay: boolean | null;
  workCalendarId: string | null;
  color?: string;
}


export interface NewFormValue {
  workCalendarId: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

@Component({
  selector: 'app-work-calendar-event-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzSwitchModule,
    NzIconModule,
    NzInputDateTimeComponent,
    NzFormItemCustomComponent,
    NzInputSelectComponent
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

      <!-- 1 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="workCalendarId" label="작업그룹 ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="workCalendarId" itemId="workCalendarId"
                [options]="workGroupList" [opt_value]="'id'" [opt_label]="'name'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="id" label="일정ID" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="id" formControlName="id" required
                placeholder="일정ID를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <!--
        <div nz-col nzSpan="20">
          <nz-form-item class="form-item">
            <nz-form-label nzFor="start" [nzXs]="defaultLabelSize.xs" [nzSm]="defaultLabelSize.sm">기간</nz-form-label>
            <nz-form-control [nzXs]="defaultControlSize.xs" [nzSm]="defaultControlSize.sm">
              <nz-date-picker formControlName="start" nzFormat="yyyy-MM-dd" style="width: 130px"></nz-date-picker>
              <nz-time-picker formControlName="start" [nzMinuteStep]="30" [nzFormat]="'HH:mm'" style="width: 90px" [nzNowText]="' '"></nz-time-picker> ~
              <nz-date-picker formControlName="end" nzFormat="yyyy-MM-dd" style="width: 130px"></nz-date-picker>
              <nz-time-picker formControlName="end" [nzMinuteStep]="30" [nzFormat]="'HH:mm'" style="width: 90px" [nzNowText]="' '"></nz-time-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
        -->
        <div nz-col nzSpan="10">
          <nz-form-item-custom for="start" label="시작일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              @if (isAllDay()) {
                <nz-date-picker nzId="start" formControlName="start" required></nz-date-picker>
              } @else {
                <app-nz-input-datetime
                  formControlName="start" itemId="start" required
                  [timeFormat]="timeFormat" [nzErrorTip]="errorTpl">
                </app-nz-input-datetime>
              }
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="10">
          <nz-form-item-custom for="end" label="종료일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              @if (isAllDay()) {
                <nz-date-picker nzId="end" formControlName="end" required></nz-date-picker>
              } @else {
                <app-nz-input-datetime
                  formControlName="end" itemId="end" required
                  [timeFormat]="timeFormat" [nzErrorTip]="errorTpl">
                </app-nz-input-datetime>
              }
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="4">
          <nz-form-item-custom for="useYn" label="종일">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <!--<label nz-checkbox nzId="allDay" formControlName="allDay" (ngModelChange)="allDayCheck($event)"></label>-->
              <nz-switch nzId="allDay" formControlName="allDay" (ngModelChange)="allDayCheck($event)"
                    [nzCheckedChildren]="checkedTemplate"
                    [nzUnCheckedChildren]="unCheckedTemplate">
                  <ng-template #checkedTemplate><span nz-icon nzType="check"></span></ng-template>
                  <ng-template #unCheckedTemplate><span nz-icon nzType="close"></span></ng-template>
              </nz-switch>

            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <nz-form-item-custom for="text" label="제목">
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <textarea nz-input id="text" formControlName="text"
            placeholder="제목을 입력해주세요." [rows]="10">
          </textarea>
        </nz-form-control>
      </nz-form-item-custom>
    </form>
  `,
  styles: []
})
export class WorkCalendarEventFormComponent implements OnInit, AfterViewInit, OnChanges {

  //text = viewChild.required<NzInputTextareaComponent>('text');

  newFormValue = input<NewFormValue>();

  timeFormat: TimeFormat = TimeFormat.HourMinute;

  workGroupList: WorkCalendar[] = [];

  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    id              : new FormControl<string | null>({value: null, disabled: true}, { validators: [Validators.required] }),
    text            : new FormControl<string | null>(null, { validators: [Validators.required] }),
    start           : new FormControl<string | Date | null>(null),
    end             : new FormControl<string | Date | null>(null),
    allDay          : new FormControl<boolean | null>(null),
    workCalendarId  : new FormControl<string | null>(null, { validators: [Validators.required] })
  });

  formDataId = input<string>('');

  isAllDay = signal<boolean>(false);

  constructor() {

    this.fg.controls.start.valueChanges.pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {
      //console.log(prev,next);
      if (this.isAllDay() && prev !== next) {
        let date = new Date(next);
        this.removeTime(date);
        this.fg.controls.start.setValue(formatDate(date,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
      }
    });

    this.fg.controls.end.valueChanges.pipe(pairwise()).subscribe(([prev, next]: [any, any]) => {
      if (this.isAllDay() && prev !== next) {
        let date = new Date(next);
        this.removeTime(date);
        this.fg.controls.end.setValue(formatDate(date,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
      }
    });

    /*
    this.fg.controls.start.events.subscribe(event => {
      if (event instanceof ValueChangeEvent) {
        let date = event.value;
        this.removeTime(date);
        this.fg.controls.start.setValue(formatDate(date,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
      }
    });
    */

    effect(() => {
      if (this.isAllDay()) {
        let start = new Date(this.fg.controls.start.value!) as Date;
        this.removeTime(start);
        console.log(start);
        this.fg.controls.start.setValue(formatDate(start,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));

        let end = new Date(this.fg.controls.end.value!) as Date;
        this.removeTime(end);
        this.fg.controls.end.setValue(formatDate(end,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
      }
    })

  }

  // 시분초 제거
  removeTime(date: Date): Date {

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  ngOnInit(): void {
    this.getMyWorkGroupList();

    if (this.formDataId()) {
      this.get(this.formDataId());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.newFormValue()) {
      this.newForm(this.newFormValue()!);
    }
  }

  ngAfterViewInit(): void {

  }

  focusInput() {
    this.renderer.selectRootElement('#text').focus();
  }

  newForm(params: NewFormValue): void {
    // 30분 단위로 입력받기 위해 초,밀리초 초기화
    params.start.setSeconds(0);
    params.start.setMilliseconds(0);
    params.end.setSeconds(0);
    params.end.setMilliseconds(0);

    this.fg.controls.workCalendarId.setValue(params.workCalendarId);

    this.fg.controls.start.setValue(formatDate(params.start,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
    this.fg.controls.end.setValue(formatDate(params.end,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));

    this.fg.controls.allDay.setValue(params.allDay);

    this.isAllDay.set(params.allDay);

    this.focusInput();
  }

  modifyForm(formData: WorkCalendarEvent): void {
    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendarevent/${id}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<WorkCalendarEvent>>(url, options).pipe(
            //catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('getWorkGroup', undefined))
            )
            .subscribe(
              (model: ResponseObject<WorkCalendarEvent>) => {
                if (model.data) {
                  this.modifyForm(model.data);
                }
              }
          )
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

    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendarevent`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<WorkCalendarEvent>>(url, this.fg.getRawValue(), options).pipe(
            //catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('saveWorkGroupSchedule', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendarEvent>) => {
            this.formSaved.emit(this.fg.getRawValue());
          }
      )
  }

  remove(): void {
    const id = this.fg.controls.id.value!;

    const url =  GlobalProperty.serverUrl() + `/api/grw/workcalendarevent/${id}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<WorkCalendarEvent>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('deleteWorkGroupSchedule', undefined))
        )
        .subscribe(
          (model: ResponseObject<WorkCalendarEvent>) => {
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

  getMyWorkGroupList(): void {
    const url =  GlobalProperty.serverUrl() + `/api/grw/myworkcalendar`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<WorkCalendar>>(url, options).pipe(
            //catchError(this.handleError<ResponseList<WorkCalendar>>('getMyWorkGroupList', undefined))
        )
        .subscribe(
          (model: ResponseList<WorkCalendar>) => {
            this.workGroupList = model.data;
            //this.notifyService.changeMessage(model.message);
          }
        )
}

  allDayCheck(check: boolean) {
    this.isAllDay.set(check);
  }
}
