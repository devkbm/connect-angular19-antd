import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { StaffSchoolCareer } from './staff-school-career.model';

@Injectable({
  providedIn: 'root'
})
export class StaffSchoolCareerService extends DataService {

  constructor() {
    super('/api/hrm/staff');
  }

  getList(staffId: string): Observable<ResponseList<StaffSchoolCareer>> {
    const url = `${this.API_URL}/${staffId}/schoolcareer`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseList<StaffSchoolCareer>>(url, options).pipe(
      catchError(this.handleError<ResponseList<StaffSchoolCareer>>('getList', undefined))
    );
  }

  get(staffId: string, id: string): Observable<ResponseObject<StaffSchoolCareer>> {
    const url = `${this.API_URL}/${staffId}/schoolcareer/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<StaffSchoolCareer>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<StaffSchoolCareer>>('get', undefined))
    );
  }

  save(obj: StaffSchoolCareer): Observable<ResponseObject<StaffSchoolCareer>> {
    const url = `${this.API_URL}/${obj.staffNo}/schoolcareer`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<StaffSchoolCareer>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<StaffSchoolCareer>>('save', undefined))
    );
  }

  delete(staffId: string, id: string): Observable<ResponseObject<StaffSchoolCareer>> {
    const url = `${this.API_URL}/staff/${staffId}/schoolcareer/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<StaffSchoolCareer>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<StaffSchoolCareer>>('delete', undefined))
      );
  }
}
