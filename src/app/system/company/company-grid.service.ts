import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ResponseList } from 'src/app/core/model/response-list';
import { DataService } from 'src/app/core/service/data.service';

import { Company } from './company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyGridService extends DataService {

  constructor() {
    super('/api/system/company');
  }

  getList(params?: any): Observable<ResponseList<Company>> {
    const url = `${this.API_URL}`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<Company>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    );
  }

}
