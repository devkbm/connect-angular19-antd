import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { RoleFormComponent } from './role-form.component';

@Component({
  selector: 'app-role-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroupComponent,
    RoleFormComponent
  ],
  template: `
    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px'}"
      [nzMaskClosable]="true"
      [nzWidth]="720"
      [nzVisible]="drawer().visible"
      nzTitle="롤 등록"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
        <app-role-form *nzDrawerContent
          [formInitId]="drawer().formInitId"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
        </app-role-form>
    </nz-drawer>

    <ng-template #footerTpl>
      <div style="float: right">
        <app-nz-crud-button-group
          [searchVisible]="false"
          [isSavePopupConfirm]="false"
          (closeClick)="closeDrawer()"
          (saveClick)="save()"
          (deleteClick)="remove()">
        </app-nz-crud-button-group>
      </div>
    </ng-template>
  `,
  styles: []

})
export class RoleFormDrawerComponent {

  drawer = input.required<{visible: boolean, formInitId: any}>();
  drawerClosed = output<any>();

  form = viewChild.required<RoleFormComponent>(RoleFormComponent);

  save() {
    this.form().save();
  }

  remove() {
    this.form().remove();
  }

  closeDrawer(params?: any) {
    this.form().closeForm();

    this.drawerClosed.emit(params);
  }

}