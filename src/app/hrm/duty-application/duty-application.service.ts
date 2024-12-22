import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { DutyApplication } from './duty-application.model';
import { DutyDate } from './duty-application.model';

@Injectable({
  providedIn: 'root'
})
export class DutyApplicationService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  /**
   * 근태신청정보를 조회한다.
   * @param params 조회조건
   */
  getList(params: any): Observable<ResponseList<DutyApplication>> {
    const url = `${this.API_URL}/dutyapplication`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http.get<ResponseList<DutyApplication>>(url, options).pipe(
      catchError(this.handleError<ResponseList<DutyApplication>>('getDutyApplicationList', undefined))
    );
  }

  /**
   * 근태신청정보를 조회한다.
   * @param id 근태신청Id
   */
  get(id: string): Observable<ResponseObject<DutyApplication>> {
    const url = `${this.API_URL}/dutyapplication/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<DutyApplication>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<DutyApplication>>('getDutyApplication', undefined))
    );
  }

  /**
   * 근태신청정보를 저장한다.
   * @param dutyApplication 근태신청정보
   */
  save(dutyApplication: DutyApplication): Observable<ResponseObject<DutyApplication>> {
    const url = `${this.API_URL}/dutyapplication`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<DutyApplication>>(url, dutyApplication, options).pipe(
      catchError(this.handleError<ResponseObject<DutyApplication>>('saveDutyApplication', undefined))
    );
  }

  /**
   * 근태신청정보를 저장한다.
   * @param id 근태신청Id
   */
  remove(id: string): Observable<ResponseObject<DutyApplication>> {
    const url = `${this.API_URL}/dutyapplication/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http
              .delete<ResponseObject<DutyApplication>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<DutyApplication>>('deleteDutyApplication', undefined))
              );
  }


  getDutyDateList(fromDate: string, toDate: string): Observable<ResponseList<DutyDate>> {
    const url = `${this.API_URL}/dutyapplication/period/${fromDate}/${toDate}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseList<DutyDate>>(url, options).pipe(
      catchError(this.handleError<ResponseList<DutyDate>>('getDutyDateList', undefined))
    );
  }


}
