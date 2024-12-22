import { Injectable } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { WorkCalendarEvent } from './work-calendar-event.model';

@Injectable({
  providedIn: 'root'
})
export class WorkCalendarEventService extends DataService {

  constructor() {
    super('/api/grw');
  }

  /**
   * @description 스케쥴을 조회한다.
   * @param id 스케쥴id
   */
  public getWorkGroupSchedule(id: number): Observable<ResponseObject<WorkCalendarEvent>> {
    const url = `${this.API_URL}/workcalendarevent/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<WorkCalendarEvent>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('getWorkGroup', undefined))
      );
  }

  /**
   * @description 스케쥴을 저장한다.
   * @param workGroupSchedule
   */
  public saveWorkGroupSchedule(workGroupSchedule: WorkCalendarEvent): Observable<ResponseObject<WorkCalendarEvent>> {
    const url = `${this.API_URL}/workcalendarevent`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .post<ResponseObject<WorkCalendarEvent>>(url, workGroupSchedule, options)
      .pipe(
        catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('saveWorkGroupSchedule', undefined))
      );
  }

  /**
   * @description 스케쥴을 삭제한다.
   * @param id 스케쥴id
   */
  public deleteWorkGroupSchedule(id: string): Observable<ResponseObject<WorkCalendarEvent>> {
    const url = `${this.API_URL}/workcalendarevent/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<WorkCalendarEvent>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<WorkCalendarEvent>>('deleteWorkGroupSchedule', undefined))
      );
  }

  /**
   * @description 작업그룹명단을 조회한다.
   * @param params 조회 조건 객체
   */
  public getWorkScheduleList(params?: any): Observable<ResponseList<WorkCalendarEvent>> {
    const url = `${this.API_URL}/workcalendarevent`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
      .get<ResponseList<WorkCalendarEvent>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<WorkCalendarEvent>>('getWorkScheduleList', undefined))
      );
  }

}
