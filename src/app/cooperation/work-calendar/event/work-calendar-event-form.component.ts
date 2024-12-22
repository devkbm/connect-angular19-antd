import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject, input, signal, effect, Renderer2, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { WorkCalendarEvent } from './work-calendar-event.model';
import { WorkCalendarEventService } from './work-calendar-event.service';
import { WorkCalendarService } from '../calendar/work-calendar.service';
import { WorkCalendar } from '../calendar/work-calendar.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { NzInputDateTimeComponent, TimeFormat } from 'src/app/third-party/ng-zorro/nz-input-datetime/nz-input-datetime.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

export interface NewFormValue {
  workCalendarId: number;
  start: Date;
  end: Date;
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

  private service = inject(WorkCalendarEventService);
  private workGroupService = inject(WorkCalendarService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    id              : new FormControl<string | null>({value: null, disabled: true}, { validators: [Validators.required] }),
    text            : new FormControl<string | null>(null, { validators: [Validators.required] }),
    start           : new FormControl<string | Date | null>(null),
    end             : new FormControl<string | Date | null>(null),
    allDay          : new FormControl<boolean | null>(null),
    workCalendarId  : new FormControl<number | null>(null, { validators: [Validators.required] })
  });

  formInitId = input<number>(-1);

  isAllDay = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isAllDay()) {
        let start = new Date(this.fg.controls.start.value!) as Date;
        console.log(start);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        this.fg.controls.start.setValue(formatDate(start,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));

        let end = new Date(this.fg.controls.end.value!) as Date;
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        end.setMilliseconds(999);
        this.fg.controls.end.setValue(formatDate(end,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
      }
    })
  }

  ngOnInit(): void {
    this.getMyWorkGroupList();

    if (this.formInitId() > 0) {
      this.get(this.formInitId());
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

    this.fg.controls.workCalendarId.setValue(Number.parseInt(params.workCalendarId.toString(),10));

    this.fg.controls.start.setValue(formatDate(params.start,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));
    this.fg.controls.end.setValue(formatDate(params.end,'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'));

    this.focusInput();
  }

  modifyForm(formData: WorkCalendarEvent): void {
    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: number): void {
    this.service.getWorkGroupSchedule(id)
        .subscribe(
            (model: ResponseObject<WorkCalendarEvent>) => {
              if (model.data) {
                console.log(model.data);
                this.modifyForm(model.data);
              }
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
        .saveWorkGroupSchedule(this.fg.getRawValue())
        .subscribe(
            (model: ResponseObject<WorkCalendarEvent>) => {
              this.formSaved.emit(this.fg.getRawValue());
            }
        );
  }

  remove(): void {
    const id = this.fg.controls.id.value!;
    this.service.deleteWorkGroupSchedule(id)
        .subscribe(
            (model: ResponseObject<WorkCalendarEvent>) => {
              this.formDeleted.emit(this.fg.getRawValue());
            }
        );
  }

  getMyWorkGroupList(): void {
    this.workGroupService
        .getMyWorkGroupList()
        .subscribe(
          (model: ResponseList<WorkCalendar>) => {
            this.workGroupList = model.data;
            //this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  allDayCheck(check: boolean) {
    this.isAllDay.set(check);
  }
}