import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { NzListModule } from 'ng-zorro-antd/list';

import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

import { StaffDutyResponsibility } from './staff-duty-responsibility.model';


@Component({
  selector: 'app-staff-duty-responsibility-list',
  imports: [
    CommonModule, NzListModule
  ],
  template: `
   <nz-list>
    @for (item of gridResource.value()?.data; track item.seq) {
      <nz-list-item>
        직책 : {{ item.dutyResponsibilityName }} &nbsp;&nbsp;&nbsp;&nbsp; 기간: {{ item.fromDate }} ~ {{ item.toDate }}
      </nz-list-item>
    }
    </nz-list>
  `,
  styles: []
})
export class StaffDutyResponsibilityListComponent {

  private http = inject(HttpClient);

  staffNo = input<string>();

  constructor() { }

  gridResource = rxResource({
    request: () => this.staffNo(),
    loader: ({request}) => this.http.get<ResponseList<StaffDutyResponsibility>>(
      GlobalProperty.serverUrl + `/api/hrm/staff/${request}/dutyresponsibility`, {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    })
  })

}
