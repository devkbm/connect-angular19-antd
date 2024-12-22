import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DataService } from 'src/app/core/service/data.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends DataService {

  constructor() {
    super('/api/system/permission');
  }

  isLogin(): Observable<boolean> {
    const url = `${this.API_URL}/islogin`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
   };

    return this.http.get<boolean>(url, options).pipe(
      catchError(this.handleError<boolean>('isLogin', undefined))
    );
  }

}
