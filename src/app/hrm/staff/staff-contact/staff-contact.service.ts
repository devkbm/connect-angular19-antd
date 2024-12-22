import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { StaffContact } from './staff-contact.model';

@Injectable({
  providedIn: 'root'
})
export class StaffContactService extends DataService {

  constructor() {
    super('/api/hrm/staff');
  }

  get(staffId: string): Observable<ResponseObject<StaffContact>> {
    const url = `${this.API_URL}/${staffId}/contact`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<StaffContact>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<StaffContact>>('getStaffAppointmentRecord', undefined))
    );
  }

  save(obj: StaffContact): Observable<ResponseObject<StaffContact>> {
    const url = `${this.API_URL}/${obj.staffNo}/contact`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<StaffContact>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<StaffContact>>('save', undefined))
    );
  }
}
