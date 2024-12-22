import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { Term } from './term.model';

@Injectable({
  providedIn: 'root'
})
export class TermService extends DataService {

  constructor() {
    super('/api/system/terms');
  }

  getTermList(params?: any): Observable<ResponseList<Term>> {
    const url = `${this.API_URL}`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<Term>>(url, options).pipe(
      catchError(this.handleError<ResponseList<Term>>('getTermList', undefined))
    );
  }

  get(id: string): Observable<ResponseObject<Term>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseObject<Term>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<Term>>('getTerm', undefined))
    );
  }

  save(term: Term): Observable<ResponseObject<Term>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    console.log(url);
    return this.http.post<ResponseObject<Term>>(url, term, options).pipe(
      catchError(this.handleError<ResponseObject<Term>>('registerTerm', undefined))
    );
  }

  delete(id: string): Observable<ResponseObject<Term>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .delete<ResponseObject<Term>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Term>>('deleteTerm', undefined))
              );
  }

  getSystemTypeList(): Observable<ResponseObject<any>> {
    const url = `${this.API_URL}/systemType`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseObject<any>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<any>>('getSystemTypeList', undefined))
    );
  }
}
