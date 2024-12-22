import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpXsrfTokenExtractor } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { Staff } from './staff.model';
import { NewStaff } from './new-staff-form/new-staff-form.model';
import { SearchStaff } from './search-staff.request';
import { StaffCurrentAppointment } from './staff-current-appointment-description.component';

@Injectable({
  providedIn: 'root'
})
export class StaffService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  getAppointmentCodeList(params?: any): Observable<ResponseList<Staff>> {
    const url = `${this.API_URL}/employee`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<Staff>>(url, options).pipe(
      catchError(this.handleError<ResponseList<Staff>>('getAppointmentCodeList', undefined))
    );
  }

  getStaffList(params: SearchStaff): Observable<ResponseList<Staff>> {
    const url = `${this.API_URL}/staff`;
    const obj:any = params;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: obj
    };

    return this.http.get<ResponseList<Staff>>(url, options).pipe(
      catchError(this.handleError<ResponseList<Staff>>('getStaffList', undefined))
    );
  }

  get(id: string): Observable<ResponseObject<Staff>> {
    const url = `${this.API_URL}/staff/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<Staff>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<Staff>>('get', undefined))
    );
  }

  save(obj: Staff): Observable<ResponseObject<Staff>> {
    const url = `${this.API_URL}/staff`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<Staff>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<Staff>>('save', undefined))
    );
  }

  newStaff(obj: NewStaff): Observable<ResponseObject<NewStaff>> {
    const url = `${this.API_URL}/staff/create`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<NewStaff>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<NewStaff>>('newStaff', undefined))
    );
  }

  downloadStaffImage(staffNo: string): Observable<Blob> {
    const url = `${this.API_URL}/staff/downloadimage`;
    const obj:any = {staffNo: staffNo};
    const token = sessionStorage.getItem('token') as string;

    const options = {
      headers: new HttpHeaders().set('X-Auth-Token', token),
      responseType: 'blob' as 'json',
      withCredentials: true,
      params: obj
    };

    return this.http.get<Blob>(url, options).pipe(
      catchError(this.handleError<Blob>('downloadEmployeeImage', undefined))
    );
  }

  getCurrentAppointment(id: string): Observable<ResponseObject<StaffCurrentAppointment>> {
    const url = `${this.API_URL}/staff/${id}/currentappointment`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<StaffCurrentAppointment>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<StaffCurrentAppointment>>('getCurrentAppointment', undefined))
    );
  }

}
