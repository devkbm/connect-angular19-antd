import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { UserService } from './user.service';


export function existingUserValidator(service: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value ? service.checkUser(control.value)
                                  .pipe(
                                    map( responseObj => {
                                      if ( responseObj.data == false ) {
                                        return {exists: responseObj.message};
                                      } else {
                                        return null;
                                      }
                                    } )
                                  ) : new Observable<null>();
  };
}

