import { Injectable } from '@angular/core';

import { Observable, catchError } from 'rxjs';

import { ResponseObject } from 'src/app/core/model/response-object';
import { DataService } from 'src/app/core/service/data.service';

import { Company } from './company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyFormService extends DataService {

  constructor() {
    super('/api/system/company');
  }

  get(id: string) {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<Company>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<Company>>('get', undefined))
    );
  }

  save(entity: Company): Observable<ResponseObject<Company>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<Company>>(url, entity, options).pipe(
      catchError(this.handleError<ResponseObject<Company>>('save', undefined))
    );
  }

  delete(id: string): Observable<ResponseObject<Company>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http
              .delete<ResponseObject<Company>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Company>>('delete', undefined))
              );
  }

}
