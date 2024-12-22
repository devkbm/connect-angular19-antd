import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';

import { Role } from './role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends DataService {

  constructor() {
    super('/api/system/role');
  }

  getRoleList(params?: any): Observable<ResponseList<Role>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
      .get<ResponseList<Role>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseList<Role>>('getRoleList', undefined))
      );
  }

  getRole(id: string): Observable<ResponseObject<Role>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<Role>>(url, options)
      .pipe(
        catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
      );
  }

  getRoleDupCheck(id: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/${id}/check`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseObject<boolean>>(url, options)
      .pipe(
        //catchError(this.handleError<ResponseObject<boolean>>('getAuthorityDupCheck', undefined))
      );
  }

  registerRole(role: Role): Observable<ResponseObject<Role>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .post<ResponseObject<Role>>(url, role, options)
      .pipe(
        catchError(this.handleError<ResponseObject<Role>>('registerAuthority', undefined))
      );
  }

  deleteRole(id: string): Observable<ResponseObject<Role>> {
    const url = `${this.API_URL}/${id}`;
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

}
