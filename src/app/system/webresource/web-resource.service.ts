import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { WebResource } from './web-resource.model';

@Injectable({
  providedIn: 'root'
})
export class WebResourceService extends DataService {

  constructor() {
    super('/api/system/webresource');
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

}
