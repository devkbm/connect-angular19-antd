import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { BizCode } from './biz-code.model';
import { ResponseList } from 'src/app/core/model/response-list';

@Injectable({
  providedIn: 'root'
})
export class BizCodeService extends DataService {

  constructor() {
    super('/api/system/bizcodetype');
  }

  getList(typeId: string): Observable<ResponseList<BizCode>> {
    const url = `${this.API_URL}/${typeId}/bizcode`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseList<BizCode>>(url, options).pipe(
      catchError(this.handleError<ResponseList<BizCode>>('getList', undefined))
    );
  }

  get(typeId: string, code: string): Observable<ResponseObject<BizCode>> {
    const url = `${this.API_URL}/${typeId}/bizcode/${code}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseObject<BizCode>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<BizCode>>('get', undefined))
    );
  }

  save(entity: BizCode): Observable<ResponseObject<BizCode>> {
    const url = `${this.API_URL}/bizcode`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.post<ResponseObject<BizCode>>(url, entity, options).pipe(
      catchError(this.handleError<ResponseObject<BizCode>>('save', undefined))
    );
  }

  delete(typeId: string, code: string): Observable<ResponseObject<BizCode>> {
    const url = `${this.API_URL}/${typeId}/bizcode/${code}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.delete<ResponseObject<BizCode>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<BizCode>>('delete', undefined))
    );
  }

}
