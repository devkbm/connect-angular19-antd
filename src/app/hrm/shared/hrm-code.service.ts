import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { HrmCode } from '../hrm-code/hrm-code.model';
import { ResponseMap } from 'src/app/core/model/response-map';
import { getHttpOptions } from 'src/app/core/http/http-utils';


@Injectable({
  providedIn: 'root'
})
export class HrmCodeService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  getMapList(params: any): Observable<ResponseMap<HrmCode>> {
    const url = `${this.API_URL}/hrmtype/codelist`;
    const options = getHttpOptions(params);

    return this.http.get<ResponseMap<HrmCode>>(url, options).pipe(
      catchError(this.handleError<ResponseMap<HrmCode>>('getMapList', undefined))
    );
  }

  getList(params: any): Observable<ResponseList<HrmCode>> {
    const url = `${this.API_URL}/hrmtype/code`;
    const options = getHttpOptions(params);

    return this.http.get<ResponseList<HrmCode>>(url, options).pipe(
      catchError(this.handleError<ResponseList<HrmCode>>('getList', undefined))
    );
  }

}
