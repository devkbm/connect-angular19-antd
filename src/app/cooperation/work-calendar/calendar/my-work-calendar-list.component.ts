import { Component, EventEmitter, OnInit, Output, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { WorkCalendarService } from './work-calendar.service';
import { WorkCalendar } from './work-calendar.model';


@Component({
  selector: 'app-my-work-calendar-list',
  imports: [ CommonModule ],
  template: `
  <!--
    <mat-selection-list #list (selectionChange)="selectionChanged($event, list)" color="primary">
      @for (item of workGroupList; track item.workCalendarId) {
        <mat-list-option
        togglePosition="before"
        [value]="item"
        (dblclick)="rowDbClicked(item)">
        {{item.color}}
      </mat-list-option>
      }
    </mat-selection-list>
    -->
  `,
  styles: [`
    .mat-mdc-list-base {
      --mdc-list-list-item-label-text-color: white;
      --mdc-list-list-item-supporting-text-color: white;
      --mdc-list-list-item-trailing-supporting-text-color: white;
      --mdc-list-list-item-disabled-label-text-color: gray;
      --mdc-list-list-item-hover-label-text-color: white;
      --mdc-list-list-item-focus-label-text-color: white;
    }
  `]
})
export class MyWorkCalendarListComponent implements OnInit {

  workGroupList: WorkCalendar[] = [];

  rowClicked = output<any>();
  rowDoubleClicked = output<any>();

  private appAlarmService = inject(AppAlarmService);
  private workGroupService = inject(WorkCalendarService);

  ngOnInit() {
    this.getMyWorkGroupList();
  }

  getMyWorkGroupList(): void {
    this.workGroupService
        .getMyWorkGroupList()
        .subscribe(
          (model: ResponseList<WorkCalendar>) => {
            this.workGroupList = model.data;
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any, list: any): void {
    let ids = list.selectedOptions.selected
                  .map((v: { value: any; }) => v.value.id)   // id 추출
                  .join(',');       // 콤마 구분자로 분리함

    this.rowClicked.emit(ids);
  }

  rowDbClicked(event: any): void {
    this.rowDoubleClicked.emit(event);
  }
}
