import { Component, OnInit, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { WorkCalendarService } from './work-calendar.service';
import { WorkCalendar } from './work-calendar.model';


@Component({
  selector: 'app-my-work-calendar-list',
  imports: [ FormsModule, NzCheckboxModule ],
  template: `

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
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];

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
