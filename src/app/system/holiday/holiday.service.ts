import { DateInfo } from './holiday.model';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { getHttpOptions } from 'src/app/core/http/http-utils';

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

    const options = getHttpOptions(params);

    return this.http.get<ResponseList<DateInfo>>(url, options).pipe(
      catchError(this.handleError<ResponseList<DateInfo>>('getHolidayList', undefined))
    );
  }

}
