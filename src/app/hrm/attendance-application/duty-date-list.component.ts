import { CommonModule } from '@angular/common';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { Component, Input, OnInit } from '@angular/core';
import { AttendanceDate } from './attendance-application.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-duty-date-list',
  imports: [
    CommonModule, FormsModule, NzCheckboxModule
  ],
  template: `
    <div class="container" [style.height]="height">
      @for (item of data; track item.date) {
        <label nz-checkbox [(ngModel)]="item.isSelected" [ngStyle]="{'color': getFontColor(item)}">
          {{item.date | date: 'yyyy-MM-dd'}}
        </label>
      }
    </div>
  `,
  styles: [`
    .container {
      overflow: auto;
    }
  `]
})
export class DutyDateListComponent implements OnInit {

  @Input() height = '100%';
  @Input() data: AttendanceDate[] = [];

  fontColor: string = 'black';

  constructor() { }

  ngOnInit() {
  }

  getFontColor(item: AttendanceDate) {
    let fontColor = 'white';

    if (item.isHoliday || item.isSunday) fontColor = 'red';   // RED SERIES
    if (item.isSaturday) fontColor = '#6495ED';               // BLUE SERIES

    return fontColor;
  }


}
