import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { Word } from './word.model';

@Injectable({
  providedIn: 'root'
})
export class WordService extends DataService {

  constructor() {
    super('/api/system/word');
  }

  getList(): Observable<ResponseList<Word>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseList<Word>>(url, options).pipe(
      catchError(this.handleError<ResponseList<Word>>('getList', undefined))
    );
  }

  get(id: string): Observable<ResponseObject<Word>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<ResponseObject<Word>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<Word>>('get', undefined))
    );
  }

  save(term: Word): Observable<ResponseObject<Word>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.post<ResponseObject<Word>>(url, term, options).pipe(
      catchError(this.handleError<ResponseObject<Word>>('save', undefined))
    );
  }

  delete(id: string): Observable<ResponseObject<Word>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .delete<ResponseObject<Word>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Word>>('delete', undefined))
              );
  }

}
