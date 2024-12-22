import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { HrmCode } from './hrm-code.model';
import { ResponseMap } from 'src/app/core/model/response-map';


@Injectable({
  providedIn: 'root'
})
export class HrmCodeService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  getMapList(params: any): Observable<ResponseMap<HrmCode>> {
    const url = `${this.API_URL}/hrmtype/codelist`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http.get<ResponseMap<HrmCode>>(url, options).pipe(
      catchError(this.handleError<ResponseMap<HrmCode>>('getMapList', undefined))
    );
  }

  getList(params: any): Observable<ResponseList<HrmCode>> {
    const url = `${this.API_URL}/hrmtype/code`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http.get<ResponseList<HrmCode>>(url, options).pipe(
      catchError(this.handleError<ResponseList<HrmCode>>('getList', undefined))
    );
  }

  valid(id: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/hrmtype/code/${id}/valid`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<boolean>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<boolean>>('valid', undefined))
    );
  }

  get(codeType: string, code: string): Observable<ResponseObject<HrmCode>> {
    const url = `${this.API_URL}/hrmtype/${codeType}/code/${code}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<HrmCode>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<HrmCode>>('get', undefined))
    );
  }


  save(obj: HrmCode): Observable<ResponseObject<HrmCode>> {
    const url = `${this.API_URL}/hrmtype/type/code`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<HrmCode>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<HrmCode>>('save', undefined))
    );
  }

  remove(codeType: string, code: string): Observable<ResponseObject<HrmCode>> {
    const url = `${this.API_URL}/hrmtype/${codeType}/code/${code}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http
              .delete<ResponseObject<HrmCode>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<HrmCode>>('remove', undefined))
              );
  }

}
