import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, map, catchError, switchMap } from 'rxjs/operators';

// https://medium.com/@ignatovich.dm/async-validators-in-angular-why-they-matter-best-practices-and-example-implementation-fdee42005674

@Injectable({ providedIn: 'root' })
export class EmailExistsValidator {
  constructor(private http: HttpClient) {}

  checkEmailExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ emailExists: boolean } | null> => {
      // Return null for empty values (valid by default)
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        // Delay processing to debounce user input
        debounceTime(500),
        // Cancel previous requests and switch to the latest
        switchMap((email) =>
          this.http.post<{ data: boolean }>('http://localhost:3000/user/check-email', { email }).pipe(
            // If the API returns data, emit { emailExists: true }; otherwise null
            map((response) => (response.data ? { emailExists: true } : null)),
            // Handle errors (e.g., network issues)
            catchError(() => of(null))
          )
        )
      );
    };
  }
}
