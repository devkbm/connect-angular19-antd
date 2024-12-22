import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { Dept } from './dept.model';
import { DeptHierarchy } from './dept-hierarchy.model';
import { GlobalProperty } from 'src/app/core/global-property';

@Injectable({
  providedIn: 'root'
})
export class DeptService extends DataService {

  constructor() {
    super('/api/system/dept');
  }

  getDeptList(params?: any): Observable<ResponseList<Dept>> {
    const url = `${this.API_URL}`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<Dept>>(url, options).pipe(
      catchError(this.handleError<ResponseList<Dept>>('getDeptList', undefined))
    );
  }

  getDeptHierarchyList(params?: any): Observable<ResponseList<DeptHierarchy>> {
    const url = GlobalProperty.serverUrl + '/api/system/depttree';
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<DeptHierarchy>>(url, options).pipe(
      catchError(this.handleError<ResponseList<DeptHierarchy>>('getDeptHierarchyList', undefined))
    );
  }

  /**
   * 부서코드 중복여부를 검증한다.
   * @param id 부서코드
   */
  getValidateDeptDup(id: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/${id}/valid`;

    //const url = GlobalProperty.serverUrl + '/common/depttree';
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<boolean>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<boolean>>('getValidateDeptDup', undefined))
    );
  }

  /**
   * 부서정보를 조회한다.
   * @param id 부서코드
   */
  getDept(id: string): Observable<ResponseObject<Dept>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.get<ResponseObject<Dept>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<Dept>>('getDept', undefined))
    );
  }

  /**
   * 부서정보를 저장한다.
   * @param dept
   */
  saveDept(dept: Dept): Observable<ResponseObject<Dept>> {
    const url = `${this.API_URL}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<Dept>>(url, dept, options).pipe(
      catchError(this.handleError<ResponseObject<Dept>>('saveDept', undefined))
    );
  }

  /**
   * 부서정보를 삭제한다.
   * @param id 부서코드
   */
  deleteDept(id: string): Observable<ResponseObject<Dept>> {
    const url = `${this.API_URL}/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http
              .delete<ResponseObject<Dept>>(url, options)
              .pipe(
                catchError(this.handleError<ResponseObject<Dept>>('deleteDept', undefined))
              );
  }

}
