import { DateInfo, Holiday } from './holiday.model';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

@Injectable({
  providedIn: 'root'
})
export class HolidayService extends DataService {

  constructor() {
    super('/api/system');
  }

  getHolidayList(fromDate: any, toDate: any): Observable<ResponseList<DateInfo>> {
    const url = `${this.API_URL}/holiday`;
    const params = {fromDate: fromDate, toDate: toDate};

    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<DateInfo>>(url, options).pipe(
      catchError(this.handleError<ResponseList<DateInfo>>('getHolidayList', undefined))
    );
  }

  getHoliday(id: string): Observable<ResponseObject<Holiday>> {
    const url = `${this.API_URL}/holiday/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .get<ResponseObject<Holiday>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Holiday>>('getHoliday', undefined))
              );
  }

  saveHoliday(entity: Holiday): Observable<ResponseObject<Holiday>> {
    const url = `${this.API_URL}/holiday`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .post<ResponseObject<Holiday>>(url, entity, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Holiday>>('saveHoliday', undefined))
              );
  }

  deleteHoliday(id: string): Observable<ResponseObject<Holiday>> {
    const url = `${this.API_URL}/holiday/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http
              .delete<ResponseObject<Holiday>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Holiday>>('deleteHoliday', undefined))
              );
  }

}
