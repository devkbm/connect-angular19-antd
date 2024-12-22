import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';

import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffDutyResponsibility } from './staff-duty-responsibility.model';
import { StaffDutyResponsibilityService } from './staff-duty-responsibility.service';

@Component({
  selector: 'app-staff-duty-responsibility-list',
  imports: [
    CommonModule, NzListModule
  ],
  template: `
   <nz-list>
    @for (item of _list; track item.seq) {
      <nz-list-item>
        직책 : {{ item.dutyResponsibilityName }} &nbsp;&nbsp;&nbsp;&nbsp; 기간: {{ item.fromDate }} ~ {{ item.toDate }}
      </nz-list-item>
    }
    </nz-list>
  `,
  styles: []
})
export class StaffDutyResponsibilityListComponent implements OnInit, AfterViewInit, OnChanges {

  _list: StaffDutyResponsibility[] = [];

  @Input() staffId?: string;

  constructor(
    private service: StaffDutyResponsibilityService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staffId']) {
      this.getList(changes['staffId'].currentValue);
    }
  }

  getList(staffId: string) {
    this.service
        .getList(staffId)
        .subscribe(
          (model: ResponseList<StaffDutyResponsibility>) => {
            this._list = model.data;
          }
        );
  }

}
