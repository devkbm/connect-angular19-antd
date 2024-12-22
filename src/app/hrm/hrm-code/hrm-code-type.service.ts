import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { HrmType } from './hrm-type.model';

@Injectable({
  providedIn: 'root'
})
export class HrmCodeTypeService extends DataService {

  constructor() {
    super('/api/hrm');
  }

  getList(params: any): Observable<ResponseList<HrmType>> {
    const url = `${this.API_URL}/hrmtype`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http.get<ResponseList<HrmType>>(url, options).pipe(
      catchError(this.handleError<ResponseList<HrmType>>('getList', undefined))
    );
  }

  valid(id: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/hrmtype/${id}/valid`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<boolean>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<boolean>>('valid', undefined))
    );
  }

  get(id: string): Observable<ResponseObject<HrmType>> {
    const url = `${this.API_URL}/hrmtype/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<HrmType>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<HrmType>>('get', undefined))
    );
  }


  save(obj: HrmType): Observable<ResponseObject<HrmType>> {
    const url = `${this.API_URL}/hrmtype`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<HrmType>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<HrmType>>('save', undefined))
    );
  }

  remove(id: string): Observable<ResponseObject<HrmType>> {
    const url = `${this.API_URL}/hrmtype/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http
               .delete<ResponseObject<HrmType>>(url, options)
               .pipe(
                  catchError(this.handleError<ResponseObject<HrmType>>('remove', undefined))
                );
  }
}
