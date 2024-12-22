import {  AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { HrmCodeTypeService } from './hrm-code-type.service';

export function existingHrmTypeValidator(service: HrmCodeTypeService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    console.log(control.root);
    console.log(control.parent?.get('typeId')?.value);
    return control.value ? service.valid(control.parent?.get('typeId')?.value + control.value)
                                  .pipe(
                                    map( responseObj => {
                                      if ( responseObj.data === true ) {
                                        return {exists: responseObj.message};
                                      } else {
                                        return null;
                                      }
                                    } )
                                  ) : new Observable<null>();
  };
}
