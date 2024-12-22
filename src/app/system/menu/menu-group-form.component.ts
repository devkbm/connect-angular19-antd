import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, inject, viewChild, Renderer2, input, effect, output } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { MenuService } from './menu.service';
import { MenuGroup } from './menu-group.model';
import { existingMenuGroupValidator } from './menu-group-duplication-validator.directive';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormItemCustomComponent } from "../../third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component";

@Component({
  selector: 'app-menu-group-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzFormItemCustomComponent
],
  template: `
    {{fg.value | json}}
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

      <!-- 1 row -->
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="menuGroupCode" label="메뉴그룹코드" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuGroupCode" formControlName="menuGroupCode" placeholder="메뉴그룹코드를 입력해주세요." />
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="menuGroupName" label="메뉴그룹명" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuGroupName" formControlName="menuGroupName" placeholder="메뉴그룹명을 입력해주세요." />
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="menuGroupUrl" label="메뉴그룹URL" required="true">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="menuGroupUrl" formControlName="menuGroupUrl" placeholder="메뉴그룹URL을 입력해주세요." />
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="description" label="비고">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="description" formControlName="description"
              placeholder="비고" [rows]="10">
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>
  `,
  styles: []
})
export class MenuGroupFormComponent implements OnInit, AfterViewInit {

  private menuService = inject(MenuService);
  private appAlarmService = inject(AppAlarmService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    /*
    menuGroupId     : new FormControl<string | null>(null, {
      validators: Validators.required,
      asyncValidators: [existingMenuGroupValidator(this.menuService)],
      updateOn: 'blur'
    }),*/
    menuGroupCode   : new FormControl<string | null>(null, { validators: Validators.required }),
    menuGroupName   : new FormControl<string | null>(null, { validators: Validators.required }),
    menuGroupUrl    : new FormControl<string | null>(null, { validators: Validators.required }),
    description     : new FormControl<string | null>(null)
  });

  initLoadId = input<string>();

  constructor() {

    effect(() => {
      if (this.initLoadId()) {
        this.get(this.initLoadId()!);
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  focusInput() {
    this.renderer.selectRootElement('#menuGroupCode').focus();
  }

  newForm(): void {
    this.fg.reset();

    this.fg.controls.menuGroupCode.enable();
    this.focusInput();
  }

  modifyForm(formData: MenuGroup): void {
    this.fg.controls.menuGroupCode.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(menuGroupId: string) {
    this.menuService
        .getMenuGroup(menuGroupId)
        .subscribe(
          (model: ResponseObject<MenuGroup>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
            this.appAlarmService.changeMessage(model.message);
          }
        );
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

    this.menuService
        .registerMenuGroup(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<MenuGroup>) => {
            this.formSaved.emit(this.fg.getRawValue());
            this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  remove() {
    this.menuService
        .deleteMenuGroup(this.fg.controls.menuGroupCode.value!)
        .subscribe(
          (model: ResponseObject<MenuGroup>) => {
            this.formDeleted.emit(this.fg.getRawValue());
            //this.appAlarmService.changeMessage(model.total + '건의 메뉴그룹이 삭제되었습니다.');
          }
        );
  }

}
