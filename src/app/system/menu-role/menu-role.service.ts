import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResponseList } from 'src/app/core/model/response-list';
import { DataService } from 'src/app/core/service/data.service';

import { MenuRoleHierarchy } from '../menu/menu-role-hierarchy.model';
import { MenuRoleMapping } from '../menu/menu-role-mapping.model';
import { MenuGroup } from '../menu/menu-group.model';

@Injectable({
  providedIn: 'root'
})
export class MenuRoleService extends DataService {

  constructor() {
    super('/api/system');
  }

  getMenuRoleHierarchy(menuGroupCode: string, roleCode: string): Observable<ResponseList<MenuRoleHierarchy>> {
    const url = `${this.API_URL}/menurolehierarchy/${menuGroupCode}/${roleCode}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .get<ResponseList<MenuRoleHierarchy>>(url, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
  }

  saveMenuRoleMapping(menu: MenuRoleMapping[]): Observable<ResponseList<MenuRoleMapping>> {
    const url = `${this.API_URL}/menurole`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
              .post<ResponseList<MenuRoleMapping>>(url, menu, options)
              .pipe(
                //catchError((err) => Observable.throw(err))
              );
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
}
