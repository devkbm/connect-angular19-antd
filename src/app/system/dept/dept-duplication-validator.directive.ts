import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DeptService } from './dept.service';

export function existingDeptValidator(service: DeptService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value ? service.getValidateDeptDup(control.value)
                                  .pipe(
                                    map( responseObj => {
                                      if ( responseObj.data == true ) {
                                        return {exists: responseObj.message};
                                      } else {
                                        return null;
                                      }
                                    } )
                                  ) : new Observable<null>();
  };
}
