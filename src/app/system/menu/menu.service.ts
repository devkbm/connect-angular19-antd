import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';
import { MenuGroup } from './menu-group.model';
import { Menu } from './menu.model';
import { MenuHierarchy } from './menu-hierarchy.model';
import { MenuRoleHierarchy } from './menu-role-hierarchy.model';
import { MenuRoleMapping } from './menu-role-mapping.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends DataService {

  constructor() {
    super('/api/system');
  }

  getMenuGroupList(params?: any): Observable<ResponseList<MenuGroup>> {
    const url = `${this.API_URL}/menugroup`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
              .get<ResponseList<MenuGroup>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  getMenuGroup(menuGroupCode: string): Observable<ResponseObject<MenuGroup>> {
    const url = `${this.API_URL}/menugroup/${menuGroupCode}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .get<ResponseObject<MenuGroup>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  getValidDupMenuGroup(menuGroupCode: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/menugroup/${menuGroupCode}/check`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .get<ResponseObject<boolean>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  registerMenuGroup(menuGroup: MenuGroup): Observable<ResponseObject<MenuGroup>> {
    const url = `${this.API_URL}/menugroup/${menuGroup.menuGroupCode}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .post<ResponseObject<MenuGroup>>(url, menuGroup, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  deleteMenuGroup(menuGroupId: string): Observable<ResponseObject<MenuGroup>> {
    const url = `${this.API_URL}/menugroup/${menuGroupId}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .delete<ResponseObject<MenuGroup>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  getMenu(menuGroupCode: string, menuCode: string): Observable<ResponseObject<Menu>> {
    const url = `${this.API_URL}/menugroup/${menuGroupCode}/menu/${menuCode}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .get<ResponseObject<Menu>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  getValidDupMenu(menuGroupCode: string, menuCode: string): Observable<ResponseObject<boolean>> {
    const url = `${this.API_URL}/menugroup/${menuGroupCode}/menu/${menuCode}/check`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .get<ResponseObject<boolean>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  getMenuList(params?: any): Observable<ResponseList<Menu>> {
    const url = `${this.API_URL}/menu`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: params
    };

    return this.http
              .get<ResponseList<Menu>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  getMenuTypeList(): Observable<ResponseObject<any>> {
    const url = `${this.API_URL}/menu/menutype`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .get<ResponseObject<any>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  registerMenu(menu: Menu): Observable<ResponseObject<Menu>> {
    const url = `${this.API_URL}/menugroup/${menu.menuGroupCode}/menu/${menu.menuCode}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .post<ResponseObject<Menu>>(url, menu, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  deleteMenu(menu: Menu): Observable<ResponseObject<Menu>> {
    const url = `${this.API_URL}/menugroup/${menu.menuGroupCode}/menu/${menu.menuCode}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .delete<ResponseObject<Menu>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  getMenuHierarchy(menuGroupId: String): Observable<ResponseList<MenuHierarchy>> {
    console.log(menuGroupId);
    const url = `${this.API_URL}/menuhierarchy/${menuGroupId}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .get<ResponseList<MenuHierarchy>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

}
