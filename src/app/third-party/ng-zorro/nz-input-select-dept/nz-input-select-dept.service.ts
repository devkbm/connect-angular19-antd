import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { NzInputSelectDeptModel } from './nz-input-select-dept.model';

@Injectable({
  providedIn: 'root'
})
export class NzInputSelectDeptService extends DataService {

  constructor() {
    super('/api/system/dept');
  }

  getDeptList(params?: any): Observable<ResponseList<NzInputSelectDeptModel>> {
    const url = `${this.API_URL}`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<NzInputSelectDeptModel>>(url, options).pipe(
      catchError(this.handleError<ResponseList<NzInputSelectDeptModel>>('getDeptList', undefined))
    );
  }

}
