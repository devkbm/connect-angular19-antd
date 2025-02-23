import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { WorkCalendarService } from './work-calendar.service';
import { WorkCalendar } from './work-calendar.model';


@Component({
  selector: 'app-my-work-calendar-list',
  imports: [ CommonModule, FormsModule, NzCheckboxModule ],
  template: `
    <!--{{workGroupList | json}}-->

    <!--
    @for (item of workGroupList; track item) {
      <label nz-checkbox [nzValue]="item.id" [(ngModel)]="item.checked">{{item.name}}</label>
    }
-->
    <nz-checkbox-group
      [nzOptions]="options"
      [(ngModel)]="value"
    ></nz-checkbox-group>

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

  `]
})
export class MyWorkCalendarListComponent implements OnInit {

  value: Array<string | number> = ['Apple', 'Orange'];
  options: NzCheckboxOption[] = [
  ];

  workGroupList: any[] = [];

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
          (model: ResponseList<any>) => {
            this.workGroupList = model.data;
            console.log(this.workGroupList);
            for (const opt of this.workGroupList) {
              this.options.push({label: opt.name!, value: opt.id!})
            }

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
