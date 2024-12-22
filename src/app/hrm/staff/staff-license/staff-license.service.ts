import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { StaffLicense } from './staff-license.model';

@Injectable({
  providedIn: 'root'
})
export class StaffLicenseService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  getList(staffId: string): Observable<ResponseList<StaffLicense>> {
    const url = `${this.API_URL}/staff/${staffId}/license`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseList<StaffLicense>>(url, options).pipe(
      catchError(this.handleError<ResponseList<StaffLicense>>('getList', undefined))
    );
  }

  get(staffId: string, seq: string): Observable<ResponseObject<StaffLicense>> {
    const url = `${this.API_URL}/staff/${staffId}/license/${seq}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<StaffLicense>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<StaffLicense>>('getCurrentAppointment', undefined))
    );
  }

  save(obj: StaffLicense): Observable<ResponseObject<StaffLicense>> {
    const url = `${this.API_URL}/staff/${obj.staffNo}/license`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<StaffLicense>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<StaffLicense>>('save', undefined))
    );
  }

  delete(staffId: string, seq: string): Observable<ResponseObject<StaffLicense>> {
    const url = `${this.API_URL}/staff/${staffId}/license/${seq}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<StaffLicense>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<StaffLicense>>('delete', undefined))
      );
  }

}


