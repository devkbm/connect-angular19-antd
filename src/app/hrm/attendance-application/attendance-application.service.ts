import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { AttendanceApplication } from './attendance-application.model';
import { AttendanceDate } from './attendance-application.model';
import { AttendanceApplicationGrid } from './attendance-application-grid.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceApplicationService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  /**
   * 근태신청정보를 조회한다.
   * @param params 조회조건
   */
  getList(params: any): Observable<ResponseList<AttendanceApplicationGrid>> {
    const url = `${this.API_URL}/dutyapplication`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http.get<ResponseList<AttendanceApplicationGrid>>(url, options).pipe(
      catchError(this.handleError<ResponseList<AttendanceApplicationGrid>>('getDutyApplicationList', undefined))
    );
  }

  /**
   * 근태신청정보를 조회한다.
   * @param id 근태신청Id
   */
  get(id: string): Observable<ResponseObject<AttendanceApplication>> {
    const url = `${this.API_URL}/dutyapplication/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<AttendanceApplication>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<AttendanceApplication>>('getDutyApplication', undefined))
    );
  }

  /**
   * 근태신청정보를 저장한다.
   * @param dutyApplication 근태신청정보
   */
  save(dutyApplication: AttendanceApplication): Observable<ResponseObject<AttendanceApplication>> {
    const url = `${this.API_URL}/dutyapplication`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<AttendanceApplication>>(url, dutyApplication, options).pipe(
      catchError(this.handleError<ResponseObject<AttendanceApplication>>('saveDutyApplication', undefined))
    );
  }

  /**
   * 근태신청정보를 저장한다.
   * @param id 근태신청Id
   */
  remove(id: string): Observable<ResponseObject<AttendanceApplication>> {
    const url = `${this.API_URL}/dutyapplication/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http
              .delete<ResponseObject<AttendanceApplication>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<AttendanceApplication>>('deleteDutyApplication', undefined))
              );
  }


  getDutyDateList(fromDate: string, toDate: string): Observable<ResponseList<AttendanceDate>> {
    const url = `${this.API_URL}/dutyapplication/period/${fromDate}/${toDate}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseList<AttendanceDate>>(url, options).pipe(
      catchError(this.handleError<ResponseList<AttendanceDate>>('getDutyDateList', undefined))
    );
  }


}
