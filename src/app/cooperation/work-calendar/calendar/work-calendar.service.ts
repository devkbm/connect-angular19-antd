import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { GlobalProperty } from 'src/app/core/global-property';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { WorkCalendar } from './work-calendar.model';
import { WorkCalendarMember } from './work-calendar-member.model';

@Injectable({
  providedIn: 'root'
})
export class WorkCalendarService extends DataService {

  constructor() {
    super('/api/grw');
  }

  /**
   * @description 작업그룹명단을 조회한다.
   * @param params 조회 조건 객체
   */
  public getWorkGroupList(params?: any): Observable<ResponseList<WorkCalendar>> {
    const url = `${this.API_URL}/workcalendar`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
      .get<ResponseList<WorkCalendar>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<WorkCalendar>>('getWorkGroupList', undefined))
      );
  }

  /**
   * @description 내가 속한 작업그룹명단을 조회한다.
   * @param params 조회 조건 객체
   */
  public getMyWorkGroupList(): Observable<ResponseList<WorkCalendar>> {
    const url = `${this.API_URL}/myworkcalendar`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseList<WorkCalendar>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<WorkCalendar>>('getMyWorkGroupList', undefined))
      );
  }

  /**
   * @description 작업그룹을 조회한다.
   * @param id 작업그룹id
   */
  public getWorkGroup(id: number): Observable<ResponseObject<WorkCalendar>> {
    const url = `${this.API_URL}/workcalendar/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<WorkCalendar>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<WorkCalendar>>('getWorkGroup', undefined))
      );
  }

  /**
   * @description 작업그룹을 저장한다.
   * @param workGroup
   */
  public saveWorkGroup(workGroup: WorkCalendar): Observable<ResponseObject<WorkCalendar>> {
    const url = `${this.API_URL}/workcalendar`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
    .post<ResponseObject<WorkCalendar>>(url, workGroup, options)
    .pipe(
      catchError(this.handleError<ResponseObject<WorkCalendar>>('saveWorkGroup', undefined))
    );

  }

  /**
   * @description 작업그룹을 삭제한다.
   * @param id 작업그룹 id
   */
  public deleteWorkGroup(id: number): Observable<ResponseObject<WorkCalendar>> {
    const url = `${this.API_URL}/workcalendar/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<WorkCalendar>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<WorkCalendar>>('deleteWorkGroup', undefined))
      );
  }

  public getMemberList(params?: any): Observable<ResponseList<WorkCalendarMember>> {
    const url = GlobalProperty.serverUrl + `/api/system/user`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
      .get<ResponseList<WorkCalendarMember>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<WorkCalendarMember>>('getMemberList', undefined))
      );
  }

}
