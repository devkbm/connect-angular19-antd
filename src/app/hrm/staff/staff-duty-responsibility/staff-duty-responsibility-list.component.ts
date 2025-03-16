import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';

import { AfterViewInit, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';

import { StaffDutyResponsibility } from './staff-duty-responsibility.model';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

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

  private http = inject(HttpClient);

  _list: StaffDutyResponsibility[] = [];

  @Input() staffId?: string;

  constructor() { }

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
    const url = GlobalProperty.serverUrl + `/api/hrm/staff/${staffId}/dutyresponsibility`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    this.http.get<ResponseList<StaffDutyResponsibility>>(url, options).pipe(
      //catchError(this.handleError<ResponseList<StaffDutyResponsibility>>('getCurrentAppointment', undefined))
    ).subscribe(
      (model: ResponseList<StaffDutyResponsibility>) => {
        this._list = model.data;
      }
    );
  }

}
