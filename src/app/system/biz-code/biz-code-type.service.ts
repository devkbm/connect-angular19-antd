import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';

import { BizCodeType } from './biz-code-type.model';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { SelectControlModel } from 'src/app/core/model/select-control.model.ts';

@Injectable({
  providedIn: 'root'
})
export class BizCodeTypeService extends DataService {

  constructor() {
    super('/api/system/bizcodetype');
  }

  getSystemList(): Observable<ResponseList<SelectControlModel>> {
    const url = `${this.API_URL}/system`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseList<SelectControlModel>>(url, options).pipe(
      catchError(this.handleError<ResponseList<SelectControlModel>>('getSystemList', undefined))
    );
  }



  getList(): Observable<ResponseList<BizCodeType>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseList<BizCodeType>>(url, options).pipe(
      catchError(this.handleError<ResponseList<BizCodeType>>('getList', undefined))
    );
  }

  get(id: string): Observable<ResponseObject<BizCodeType>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseObject<BizCodeType>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<BizCodeType>>('get', undefined))
    );
  }

  save(term: BizCodeType): Observable<ResponseObject<BizCodeType>> {
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.post<ResponseObject<BizCodeType>>(this.API_URL, term, options).pipe(
      catchError(this.handleError<ResponseObject<BizCodeType>>('save', undefined))
    );
  }

  delete(id: string): Observable<ResponseObject<BizCodeType>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<BizCodeType>>(url, options).pipe(
        catchError(this.handleError<ResponseObject<BizCodeType>>('delete', undefined))
      );
  }

}
