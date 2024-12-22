import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { StaffFamily } from './staff-family.model';

@Injectable({
  providedIn: 'root'
})
export class StaffFamilyService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  getList(staffId: string): Observable<ResponseList<StaffFamily>> {
    const url = `${this.API_URL}/staff/${staffId}/family`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseList<StaffFamily>>(url, options).pipe(
      catchError(this.handleError<ResponseList<StaffFamily>>('getList', undefined))
    );
  }

  get(staffId: string, seq: string): Observable<ResponseObject<StaffFamily>> {
    const url = `${this.API_URL}/staff/${staffId}/family/${seq}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<StaffFamily>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<StaffFamily>>('getCurrentAppointment', undefined))
    );
  }

  save(obj: StaffFamily): Observable<ResponseObject<StaffFamily>> {
    const url = `${this.API_URL}/staff/${obj.staffNo}/family`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<StaffFamily>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<StaffFamily>>('save', undefined))
    );
  }

  delete(staffId: string, seq: string): Observable<ResponseObject<StaffFamily>> {
    const url = `${this.API_URL}/staff/${staffId}/family/${seq}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<StaffFamily>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<StaffFamily>>('delete', undefined))
      );
  }

}

