import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { StaffDutyResponsibility } from './staff-duty-responsibility.model';

@Injectable({
  providedIn: 'root'
})
export class StaffDutyResponsibilityService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  getList(staffId: string): Observable<ResponseList<StaffDutyResponsibility>> {
    const url = `${this.API_URL}/staff/${staffId}/dutyresponsibility`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseList<StaffDutyResponsibility>>(url, options).pipe(
      catchError(this.handleError<ResponseList<StaffDutyResponsibility>>('getCurrentAppointment', undefined))
    );
  }

  get(staffId: string, seq: string): Observable<ResponseObject<StaffDutyResponsibility>> {
    const url = `${this.API_URL}/staff/${staffId}/dutyresponsibility/${seq}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<StaffDutyResponsibility>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<StaffDutyResponsibility>>('getCurrentAppointment', undefined))
    );
  }

  save(obj: StaffDutyResponsibility): Observable<ResponseObject<StaffDutyResponsibility>> {
    const url = `${this.API_URL}/staff/${obj.staffNo}/dutyresponsibility/`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<StaffDutyResponsibility>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<StaffDutyResponsibility>>('save', undefined))
    );
  }

}
