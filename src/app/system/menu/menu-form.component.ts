import { Component, OnInit, AfterViewInit, inject, Renderer2, input, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { NotifyService } from 'src/app/core/service/notify.service';

import { Menu } from './menu.model';
import { MenuHierarchy } from './menu-hierarchy.model';
import { MenuGroup } from './menu-group.model';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormItemCustomComponent } from "../../third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component";
import { NzInputSelectComponent } from "../../third-party/ng-zorro/nz-input-select/nz-input-select.component";
import { NzInputTreeSelectComponent } from "../../third-party/ng-zorro/nz-input-tree-select/nz-input-tree-select.component";
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { MenuFormValidatorService } from './validator/menu-form-validator.service';

@Component({
  selector: 'app-menu-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzFormItemCustomComponent,
    NzInputSelectComponent,
    NzInputTreeSelectComponent
],
  template: `
    {{fg.getRawValue() | json}}
    {{fg.valid}}
    <form nz-form [formGroup]="fg" nzLayout="vertical">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <!-- 1 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="menuGroupCode" label="메뉴그룹코드" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required="true"
                formControlName="menuGroupCode" itemId="menuGroupCode"
                (ngModelChange)="selectMenuGroup($event)"
                [options]="menuGroupList" [opt_value]="'menuGroupCode'" [opt_label]="'menuGroupName'"
                placeholder="Please select"
              >
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="parentMenuCode" label="상위 메뉴" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-tree-select
                formControlName="parentMenuCode" itemId="parentMenuCode"
                [nodes]="menuHiererachy"
                placeholder="상위 메뉴 없음">
              </nz-input-tree-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="6">
          <nz-form-item-custom for="menuCode" label="메뉴코드" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuCode" formControlName="menuCode" required
                placeholder="메뉴코드를 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="menuName" label="메뉴명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuName" formControlName="menuName" required
                placeholder="메뉴명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="menuType" label="메뉴타입" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required="true"
                formControlName="menuType" itemId="menuType"
                [options]="menuTypeList" [opt_value]="'value'" [opt_label]="'label'"
                placeholder="메뉴타입을 선택해주세요">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="6">
          <nz-form-item-custom for="sequence" label="순번" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-number nzId="sequence" formControlName="sequence" required
                [nzMin]="0" [nzMax]="9999" placeholder="순번을 입력해주세요.">
              </nz-input-number>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <!-- 3 Row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="appUrl" label="APP URL" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="appUrl" formControlName="appUrl" required
                placeholder="URL을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="appIconType" label="APP ICON TYPE" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <!--
              <input nz-input id="appIconType" formControlName="appIconType" required
                placeholder="ICON TYPE을 입력해주세요."/>
              -->
              <nz-input-select required
                formControlName="appIconType" itemId="appIconType"
                [options]="appIconTypeList" [opt_value]="'value'" [opt_label]="'label'"
                placeholder="ICON TYPE을 입력해주세요.">
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="appIcon" label="APP ICON" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
            @if (this.fg.controls.appIconType.value === 'RESOURCE') {
              <nz-input-select required
                formControlName="appIcon" itemId="appIcon"
                [options]="resourceList" [opt_value]="'resourceId'" [opt_label]="'resourceName'"
                placeholder="ICON을 입력해주세요.">
              </nz-input-select>
            } @else {
              <input nz-input id="appIcon" formControlName="appIcon" required
                placeholder="ICON을 입력해주세요."/>
            }
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class MenuFormComponent implements OnInit, AfterViewInit {

  appIconTypeList :{value: string, label: string}[] = [
    {value: 'NZ_ICON', label: 'NZ ICON'},
    {value: 'RESOURCE', label: 'RESOURCE'}
  ];

  resourceList: any;

  /**
   * 상위 메뉴 트리
   */
  menuHiererachy: MenuHierarchy[] = [];
  menuGroupList: any;
  menuTypeList: any;

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);
  private validator = inject(MenuFormValidatorService);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
      menuGroupCode       : new FormControl<string | null>(null, { validators: Validators.required }),
      menuCode            : new FormControl<string | null>(null, {
        validators: Validators.required,
        asyncValidators: [this.validator.existingEntityValidator()],
        updateOn: 'blur'
      }),
      menuName          : new FormControl<string | null>(null, { validators: Validators.required }),
      menuType          : new FormControl<string | null>(null, { validators: Validators.required }),
      parentMenuCode    : new FormControl<string | null>(null),
      sequence          : new FormControl<number | null>(null),
      appUrl            : new FormControl<string | null>(null, { validators: Validators.required }),
      appIconType       : new FormControl<string | null>(null),
      appIcon           : new FormControl<string | null>(null)
  });

  formDataId = input<{menuGroupCode: string, menuCode: string}>();

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        if (this.formDataId()?.menuGroupCode && this.formDataId()?.menuCode) {
          this.get(this.formDataId()?.menuGroupCode!, this.formDataId()?.menuCode!);
        } else if (this.formDataId()?.menuGroupCode && !this.formDataId()?.menuCode) {
          this.newForm(this.formDataId()?.menuGroupCode!);
        }
      }
    });
  }

  ngOnInit() {
    this.getMenuTypeList();
    this.getMenuGroupList();
    this.getResourceList();
  }

  ngAfterViewInit(): void {

  }

  focusInput() {
    this.renderer.selectRootElement('#menuCode').focus();
  }

  newForm(menuGroupCode: string): void {

    this.getMenuHierarchy(menuGroupCode);

    this.fg.controls.menuGroupCode.setValue(menuGroupCode);
    //this.fg.controls.menuCode.disable();

    this.focusInput();
  }

  modifyForm(formData: Menu): void {

    this.getMenuHierarchy(formData.menuGroupCode!);
    this.fg.controls.menuCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(menuGroupCode: string, menuCode: string) {
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${menuGroupCode}/menu/${menuCode}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseObject<Menu>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<Menu>) => {
            if ( model.data ) {
              this.modifyForm(model.data);
            } else {
              this.newForm(menuGroupCode);
            }
          }
        )
  }

  save() {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const menuGroupCode = this.fg.controls.menuGroupCode.value;
    const menuCode = this.fg.controls.menuCode.value;
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${menuGroupCode}/menu/${menuCode}`;
    const options = getHttpOptions();

    this.http
        .post<ResponseObject<Menu>>(url, this.fg.getRawValue(), options).pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<Menu>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )

  }

  remove(): void {
    const menuGroupCode = this.fg.controls.menuGroupCode.value;
    const menuCode = this.fg.controls.menuCode.value;
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup/${menuGroupCode}/menu/${menuCode}`;
    const options = getHttpOptions();

    this.http
        .delete<ResponseObject<Menu>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseObject<Menu>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            this.notifyService.changeMessage(model.message);
          }
        )

  }

  getMenuHierarchy(menuGroupId: string): void {
    if (!menuGroupId) return;

    const url = GlobalProperty.serverUrl() + `/api/system/menuhierarchy/${menuGroupId}}`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<MenuHierarchy>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseList<MenuHierarchy>) => {
            this.menuHiererachy = model.data;
          }
        )
  }

  getMenuGroupList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/menugroup`;
    const options = getHttpOptions();

    this.http
        .get<ResponseList<MenuGroup>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            this.menuGroupList = model.data;
          }
        )

  }

  getMenuTypeList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/menu/menutype`;
    const options = getHttpOptions();

    this.http
    .get<ResponseObject<any>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<Role>>('getRole', undefined))
        )
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            this.menuTypeList = model.data;
          }
        )

  }

  getResourceList(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/webresource`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<any>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseObject<any>) => {
        this.resourceList = model.data;
      }
    );
  }

  selectMenuGroup(menuGroupId: any): void {
    if (!menuGroupId) return;

    this.getMenuHierarchy(menuGroupId);
  }

}
