import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { GlobalProperty } from 'src/app/core/global-property';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { UserNotFoundError } from 'src/app/core/error/user-not-found-error';

import { User } from './user.model';
import { Role } from '../role/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService {

  private AUTHORITY_API_URI = '/api/system/role';
  private MENU_GROUP_API_URI = '/api/system/menugroup';

  constructor() {
    super('/api/system/user');
  }

  checkUser(id: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/${id}/check`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<boolean>>(url, options).pipe(
        catchError(this.handleError<ResponseObject<boolean>>('checkUser', undefined))
      );
  }

  getUser(id: string): Observable<ResponseObject<User>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<User>>(url, options).pipe(
        catchError(this.handleError<ResponseObject<User>>('getUser', undefined))
      );
  }

  getUserList(params?: any): Observable<ResponseList<User>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
      .get<ResponseList<User>>(url, options).pipe(
        catchError(this.handleError<ResponseList<User>>('getUserList', undefined))
      );
  }

  registerUser(user: User): Observable<ResponseObject<User>> {
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .post<ResponseObject<User>>(this.API_URL, user, options).pipe(
        catchError(this.handleError<ResponseObject<User>>('registerUser', undefined))
      );
  }

  deleteUser(userId: string): Observable<ResponseObject<User>> {
    const url = this.API_URL + '/' + userId;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<User>>(url, options).pipe(
        catchError(this.handleError<ResponseObject<User>>('deleteUser', undefined))
      );
  }

  downloadUserImage(userId: string): Observable<Blob> {
    const url = this.API_URL + `/image`;
    const obj:any = {companyCode: sessionStorage.getItem('companyCode'),  userId: userId};
    const token = sessionStorage.getItem('token') as string;

    const options = {
      headers: new HttpHeaders().set('X-Auth-Token', token),
      responseType: 'blob' as 'json',
      withCredentials: true,
      params: obj
    };

    return this.http.get<Blob>(url, options).pipe(
      catchError(this.handleError<Blob>('downloadUserImage', undefined))
    );
  }

  initializePassword(user: User): Observable<ResponseObject<string>> {
    const url = this.API_URL + '/' + user.userId + '/initPassword';
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .post<ResponseObject<string>>(url, user, options)
      .pipe(
        catchError(this.handleError<ResponseObject<string>>('initializePassword', undefined))
      );
  }

  getAuthorityList(params?: any): Observable<ResponseList<Role>> {
    const url = GlobalProperty.serverUrl + `${this.AUTHORITY_API_URI}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
      .get<ResponseList<Role>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<Role>>('getAuthorityList', undefined))
      );
  }

  getAuthority(id: string): Observable<ResponseObject<Role>> {
    const url = GlobalProperty.serverUrl + `${this.AUTHORITY_API_URI}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<Role>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<Role>>('getAuthority', undefined))
      );
  }

  getAuthorityDupCheck(id: string): Observable<ResponseObject<boolean>> {
    const url = GlobalProperty.serverUrl + `${this.AUTHORITY_API_URI}/${id}/check`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<boolean>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<boolean>>('getAuthorityDupCheck', undefined))
      );
  }

  registerAuthority(authority: Role): Observable<ResponseObject<Role>> {
    const url = GlobalProperty.serverUrl + `${this.AUTHORITY_API_URI}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .post<ResponseObject<Role>>(url, authority, options)
      .pipe(
        catchError(this.handleError<ResponseObject<Role>>('registerAuthority', undefined))
      );
  }

  deleteAuthority(id: string): Observable<ResponseObject<Role>> {
    const url = GlobalProperty.serverUrl + `${this.AUTHORITY_API_URI}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<Role>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<Role>>('deleteAuthority', undefined))
      );
  }

  getTest(): Observable<ResponseList<any>> {
    const url = GlobalProperty.serverUrl + '/oauth2/authorization/google';
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseList<any>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<any>>('getTest', undefined))
      );
  }

}
