import { Component, input, output, viewChild } from '@angular/core';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { StaffDutyResponsibilityFormComponent } from './staff-duty-responsibility-form.component';

@Component({
  selector: 'app-staff-duty-responsibility-form-drawer',
  imports: [
    NzDrawerModule,
    NzCrudButtonGroupComponent,
    StaffDutyResponsibilityFormComponent
  ],
  template: `
    <nz-drawer
      nzTitle="직책 등록"
      nzWidth="80%"
      [nzMaskClosable]="true"
      [nzVisible]="drawer().visible"
      [nzFooter]="footerTpl"
      (nzOnClose)="drawer().visible = false">
        <app-staff-duty-responsibility-form *nzDrawerContent
          [formDataId]="drawer().formDataId"
          [staff]="selectedStaff()"
          (formSaved)="closeDrawer($event)"
          (formDeleted)="closeDrawer($event)"
          (formClosed)="drawer().visible = false">
        </app-staff-duty-responsibility-form>
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
export class StaffDutyResponsibilityFormDrawerComponent {

  drawer = input.required<{visible: boolean, formDataId: any}>();
  drawerClosed = output<any>();

  selectedStaff = input<any>();

  form = viewChild.required<StaffDutyResponsibilityFormComponent>(StaffDutyResponsibilityFormComponent);

  save() {
    this.form().save();
  }

  remove() {
    //this.form().remove();
  }

  closeDrawer(params?: any) {
    this.form().closeForm();

    this.drawerClosed.emit(params);
  }

}
