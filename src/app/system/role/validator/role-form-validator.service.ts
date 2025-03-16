import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';
import { ResponseObject } from 'src/app/core/model/response-object';

@Injectable({
  providedIn: 'root'
})
export class RoleFormValidatorService {

  private http = inject(HttpClient);

  constructor() { }

  existingEntityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{exists: boolean} | null> => {

      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(1000),
        switchMap((val) => {

          const url = GlobalProperty.serverUrl + `/api/system/role/${control.value}/check`;
          const options = {
            headers: getAuthorizedHttpHeaders(),
            withCredentials: true
          }

          return this.http.get<ResponseObject<boolean>>(url, options).pipe(
                    // catchError(this.handleError<ResponseObject<boolean>>('checkUser', undefined))
                   map( (response) => (response.data === false ? {exists: true} : null)),
                   catchError(() => of(null))
          )
          }
        )
      );
    };
  }

}
