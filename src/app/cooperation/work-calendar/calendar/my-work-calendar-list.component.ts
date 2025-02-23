import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox';

import { ResponseList } from 'src/app/core/model/response-list';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';

import { WorkCalendarService } from './work-calendar.service';


@Component({
  selector: 'app-my-work-calendar-list',
  imports: [ CommonModule, NzGridModule, FormsModule, NzCheckboxModule, NzIconModule ],
  template: `
    <!--
    <div>
      {{value | json}}
    </div>
    -->
    <nz-checkbox-group [(ngModel)]="value" (ngModelChange)="selectionChanged($event)">
      @for (item of workGroupList; track item) {
        <nz-row [nzGutter]="4">
          <nz-col>
            <div class="color-box" [style.background-color]="item.color">&nbsp;</div>
          </nz-col>
          <nz-col>
            <label nz-checkbox [nzValue]="item.id">{{item.name}}</label>
            <nz-icon nzType="edit" nzTheme="outline" (click)="rowDbClicked(item.id)" />
          </nz-col>
        </nz-row>
      }
    </nz-checkbox-group>
  `,
  styles: [`
    .color-box {
      border: 1px solid rgba(56, 56, 56, 0.77);
      width: 20px;
    }
  `]
})
export class MyWorkCalendarListComponent implements OnInit {

  workGroupList: any[] = [];

  value: Array<string | number> = [];
  options: NzCheckboxOption[] = [];

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

            for (const opt of this.workGroupList) {
              this.options.push({label: opt.name!, value: opt.id!})
            }

            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  selectionChanged(event: any): void {
    this.rowClicked.emit(event);
  }

  rowDbClicked(event: any): void {
    this.rowDoubleClicked.emit(event);
  }
}
