import { Component, OnInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserImageUploadComponent } from './user-image-upload.component';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { User } from './user.model';
import { Role } from '../role/role.model';
import { DeptHierarchy } from '../dept/dept-hierarchy.model';
import { UserFormValidatorService } from './validator/user-form-validator.service';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { NzInputTreeSelectDeptComponent } from 'src/app/third-party/ng-zorro/nz-input-tree-select-dept/nz-input-tree-select-dept.component';


@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserImageUploadComponent,

    NzFormModule,
    NzInputModule,
    NzSwitchModule,
    NzFormItemCustomComponent,
    NzInputTreeSelectDeptComponent,
    NzInputSelectComponent
  ],
  template: `
    {{fg.getRawValue() | json}} - {{fg.valid}}
    <!--{{fileList | json}}-->
    <form nz-form [formGroup]="fg" nzLayout="vertical">

      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 아이디가 존재합니다.
        }
        @if (control.hasError('email')) {
          이메일을 확인해주세요.
        }
      </ng-template>

      <!-- 1 row -->
      <div nz-row>
        <div nz-col nzSpan="4">
          <app-user-image-upload
            [userId]="this.fg.controls.userId.value!"
            [pictureFileId]="imageBase64">
          </app-user-image-upload>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <nz-form-item-custom for="userId" label="아이디" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="userId" formControlName="userId" required readonly/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="companyCode" label="조직코드" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="companyCode" formControlName="companyCode" required
                placeholder="조직코드를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="staffNo" label="직원번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="staffNo" formControlName="staffNo" required
                placeholder="직원번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="name" label="이름" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="name" formControlName="name" required
                placeholder="이름을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="4">
          <nz-form-item-custom for="enabled" label="사용여부" required>
            <nz-form-control>
              <nz-switch nzId="enabled" formControlName="enabled">
              </nz-switch>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="10">
          <nz-form-item-custom for="mobileNum" label="휴대폰번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="mobileNum" formControlName="mobileNum" required
                placeholder="휴대폰 번호을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="10">
          <nz-form-item-custom for="email" label="이메일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="email" formControlName="email" required/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <!--<nz-divider nzPlain nzText="기타정보" nzOrientation="left"></nz-divider>-->

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="deptCode" label="부서">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-tree-select-dept itemId="deptCode" formControlName="deptCode" placeholder="부서 없음">
              </nz-input-tree-select-dept>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="roleList" label="롤" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="roleList" itemId="roleList"
                [options]="authList" [opt_value]="'roleCode'" [opt_label]="'description'" [mode]="'tags'"
                placeholder="Please select">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>
    </form>
  `,
  styles: []
})
export class UserFormComponent implements OnInit {

  public authList: any;
  public deptHierarchy: DeptHierarchy[] = [];

  passwordConfirm: string = '';
  popup: boolean = false;

  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false
  };

  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl: string = GlobalProperty.serverUrl() + '/api/system/user/image/';
  imageUploadHeader: any = {
    Authorization: sessionStorage.getItem('token')
    //'x-auth-token': sessionStorage.getItem('token')
    //'Content-Type': 'multipart/form-data'
  };
  uploadParam: any = {};

  imageBase64: any;

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);
  private validator = inject(UserFormValidatorService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    userId: new FormControl<string | null>(null, {
      validators: Validators.required,
      asyncValidators: [this.validator.existingUserValidator()],
      updateOn: 'blur'
    }),
    companyCode: new FormControl<string | null>({ value: null, disabled: true }, { validators: Validators.required }),
    staffNo: new FormControl<string | null>(null),
    name: new FormControl<string | null>({ value: null, disabled: false }, { validators: Validators.required }),
    enabled: new FormControl<boolean>(true),
    deptCode: new FormControl<string | null>(null),
    mobileNum: new FormControl<string | null>(null),
    email: new FormControl<string | null>({ value: null, disabled: false }, { validators: Validators.email }),
    imageBase64: new FormControl<string | null>(null),
    roleList: new FormControl<string[] | null>({ value: null, disabled: false }, { validators: Validators.required })
  });

  formDataId = input<string>('');

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId());
      }
    })

    this.fg.controls.staffNo.valueChanges.subscribe(x => {
      if (x === null) return;
      const companyCode = sessionStorage.getItem('companyCode');
      //this.fg.controls.userId.setValue(companyCode + x);
      this.fg.controls.userId.setValue(x);
      this.fg.controls.userId.markAsTouched();
    });
  }

  ngOnInit(): void {
    this.getRoleList();
    this.getDeptHierarchy();
  }

  focusInput() {
    this.renderer.selectRootElement('#staffNo').focus();
  }

  newForm(): void {
    this.imageBase64 = null;
    this.previewImage = '';

    this.fg.reset();

    this.fg.controls.userId.setAsyncValidators(this.validator.existingUserValidator());
    this.fg.controls.companyCode.setValue(sessionStorage.getItem('companyCode'));
    this.fg.controls.staffNo.enable();
    this.fg.controls.enabled.setValue(true);

    /*
    this.fg.controls.staffNo.valueChanges.subscribe(x => {
      if (x === null) return;
      const companyCode = sessionStorage.getItem('companyCode');
      //this.fg.controls.userId.setValue(companyCode + x);
      this.fg.controls.userId.setValue(x);
      this.fg.controls.userId.markAsTouched();
    });
    */
    this.focusInput();
  }

  modifyForm(formData: User): void {
    this.fg.controls.userId.setAsyncValidators(null);
    this.fg.controls.staffNo.disable();

    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.value);
  }

  get(userId: string): void {
    const url = GlobalProperty.serverUrl() + `/api/system/user/${userId}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<User>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<User>>('getUser', undefined))
        )
        .subscribe(
          (model: ResponseObject<User>) => {
            model.data ? this.modifyForm(model.data) : this.newForm();

            if (model.data?.imageBase64 != null) {
              this.imageBase64 = model.data.imageBase64;
            } else {
              this.imageBase64 = '';
            }

          }
        )
  }

  save(): void {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    /*
    this.service
        .registerUser(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<User>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
    */

    const url = GlobalProperty.serverUrl() + `/api/system/user`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<User>>(url, this.fg.getRawValue(), options).pipe(
        //  catchError(this.handleError<ResponseObject<User>>('registerUser', undefined))
        )
        .subscribe(
          (model: ResponseObject<User>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/user/${this.fg.controls.userId.value}`;
    const options = getHttpOptions()

    this.http
        .delete<ResponseObject<User>>(url, options).pipe(
     //     catchError(this.handleError<ResponseObject<User>>('deleteUser', undefined))
        )
        .subscribe(
          (model: ResponseObject<User>) => {
            this.notifyService.changeMessage(model.message);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        )
  }

  getRoleList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/role`;
    const options = getHttpOptions()

    this.http
        .get<ResponseList<Role>>(url, options).pipe(
          // catchError(this.handleError<ResponseList<Role>>('getAuthorityList', undefined))
        )
        .subscribe(
          (model: ResponseList<Role>) => {
            this.authList = model.data;
          }
        )
  }

  getDeptHierarchy(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/role`;
    const options = getHttpOptions()

    this.http.get<ResponseList<DeptHierarchy>>(url, options).pipe(
        //  catchError(this.handleError<ResponseList<DeptHierarchy>>('getDeptHierarchyList', undefined))
        )
        .subscribe(
          (model: ResponseList<DeptHierarchy>) => {
            this.deptHierarchy = model.data;
          }
        )
  }

}
