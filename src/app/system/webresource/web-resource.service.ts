import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { WebResource } from './web-resource.model';
import { ResouceTypeEnum } from './resource-type-enum';

@Injectable({
  providedIn: 'root'
})
export class WebResourceService extends DataService {

  constructor() {
    super('/api/system/webresource');
  }

  getWebResourceTypeList(): Observable<ResponseList<ResouceTypeEnum>> {
    const url = `${this.API_URL}/resourcetype`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

   return this.http.get<ResponseList<ResouceTypeEnum>>(url, options).pipe(
  );
  }

  getList(params?: any): Observable<ResponseList<WebResource>> {
    const url = `${this.API_URL}`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<WebResource>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    );
  }

  get(id: string): Observable<ResponseObject<WebResource>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<WebResource>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    );
  }

  getDupCheck(id: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/${id}/check`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<boolean>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    );
  }

  save(program: WebResource): Observable<ResponseObject<WebResource>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<WebResource>>(url, program, options).pipe(
      //catchError((err) => Observable.throw(err))
    );
  }

  delete(id: string): Observable<ResponseObject<WebResource>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http
              .delete<ResponseObject<WebResource>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

}
