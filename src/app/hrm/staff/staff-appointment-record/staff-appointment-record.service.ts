import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { StaffAppointmentRecord } from './staff-appointment-record.model';

@Injectable({
  providedIn: 'root'
})
export class StaffAppointmentRecordService extends DataService {

  constructor() {
    super('/api/hrm/staff');
  }

  getList(staffId: string): Observable<ResponseList<StaffAppointmentRecord>> {
    const url = `${this.API_URL}/${staffId}/record`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseList<StaffAppointmentRecord>>(url, options).pipe(
      catchError(this.handleError<ResponseList<StaffAppointmentRecord>>('getList', undefined))
    );
  }

  get(staffId: string, id: string): Observable<ResponseObject<StaffAppointmentRecord>> {
    const url = `${this.API_URL}/${staffId}/appointmentrecord/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<StaffAppointmentRecord>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('get', undefined))
    );
  }

  save(obj: StaffAppointmentRecord): Observable<ResponseObject<StaffAppointmentRecord>> {
    const url = `${this.API_URL}/${obj.staffNo}/appointmentrecord`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<StaffAppointmentRecord>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('save', undefined))
    );
  }

  delete(staffId: string, id: string): Observable<ResponseObject<StaffAppointmentRecord>> {
    const url = `${this.API_URL}/staff/${staffId}/appointmentrecord/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<StaffAppointmentRecord>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<StaffAppointmentRecord>>('delete', undefined))
      );
  }

}
