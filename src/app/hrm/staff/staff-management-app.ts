import { Component, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StaffRegistFormComponent } from './staff-regist-form.component';
import { StaffGridComponent } from './staff-grid.component';
import { StaffAppointmentRecordGridComponent } from './staff-appointment-record/staff-appointment-record-grid.component';
import { StaffFamilyGridComponent } from './staff-family/staff-family-grid.component';
import { StaffFamily } from './staff-family/staff-family.model';
import { StaffLicense } from './staff-license/staff-license.model';
import { StaffLicenseGridComponent } from './staff-license/staff-license-grid.component';
import { StaffAppointmentRecord } from './staff-appointment-record/staff-appointment-record.model';
import { StaffSchoolCareer } from './staff-school-career/staff-school-career.model';
import { StaffSchoolCareerGridComponent } from './staff-school-career/staff-school-career-grid.component';
import { StaffCurrentAppointmentDescriptionComponent } from './staff-current-appointment-description.component';
import { StaffCardListComponent } from './staff-card/staff-card-list.component';
import { StaffContactFormComponent } from './staff-contact/staff-contact-form.component';
import { StaffDutyResponsibilityListComponent } from './staff-duty-responsibility/staff-duty-responsibility-list.component';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { ShapeComponent } from "src/app/core/app/shape.component";
import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzButtonExcelUploadComponent } from "src/app/third-party/ng-zorro/nz-button-excel-upload/nz-button-excel-upload.component";

import { NewStaffFormDrawerComponent } from './new-staff-form/new-staff-form-drawer.component';
import { StaffAppointmentRecordFormDrawerComponent } from './staff-appointment-record/staff-appointment-record-form-drawer.component';
import { StaffDutyResponsibilityFormDrawerComponent } from './staff-duty-responsibility/staff-duty-responsibility-form-drawer.component';
import { StaffFamilyFormDrawerComponent } from './staff-family/staff-family-form-drawer.component';
import { StaffLicenseFormDrawerComponent } from './staff-license/staff-license-form-drawer.component';
import { StaffSchoolCareerFormDrawerComponent } from './staff-school-career/staff-school-career-form-drawer.component';

@Component({
  selector: 'staff-management-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzTabsModule,
    NzCollapseModule,
    NzDividerModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderCustomComponent,
    StaffAppointmentRecordFormDrawerComponent,
    StaffAppointmentRecordGridComponent,
    StaffFamilyFormDrawerComponent,
    StaffFamilyGridComponent,
    NewStaffFormDrawerComponent,
    StaffContactFormComponent,
    StaffDutyResponsibilityFormDrawerComponent,
    StaffDutyResponsibilityListComponent,
    StaffLicenseFormDrawerComponent,
    StaffLicenseGridComponent,
    StaffSchoolCareerFormDrawerComponent,
    StaffSchoolCareerGridComponent,
    StaffRegistFormComponent,
    StaffGridComponent,
    StaffCurrentAppointmentDescriptionComponent,
    StaffCardListComponent,
    ShapeComponent,
    NzButtonExcelUploadComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="직원정보관리" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <div nz-row class="btn-group">

    <div nz-col [nzSpan]="24" style="text-align: right;">
      {{selectedStaff | json}}
      <app-nz-button-excel-upload [urn]="'/api/hrm/staff/create/excel'">
        </app-nz-button-excel-upload>
      <button nz-button (click)="selectGridStaff()">
        <span nz-icon nzType="search" nzTheme="outline"></span>조회
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button nzType="primary" (click)="newStaff()">
        <span nz-icon nzType="save" nzTheme="outline"></span>신규직원등록
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button nz-button nzType="primary" (click)="newDutyResponsibility()">
        <span nz-icon nzType="save" nzTheme="outline"></span>직책등록
      </button>
    </div>
  </div>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="app-grid">
    <app-staff-grid
      (rowClicked)="staffGridRowClicked($event)">
    </app-staff-grid>

    <div>
      <app-staff-regist-form [staffNo]="selectedStaff?.staffNo">
      </app-staff-regist-form>
      <nz-collapse>
        <nz-collapse-panel [nzHeader]="'발령'">
          <app-staff-current-appointment-description [staffNo]="selectedStaff?.staffNo">
          </app-staff-current-appointment-description>
        </nz-collapse-panel>
        <nz-collapse-panel [nzHeader]="'보직'">
          <div style="height:100px; padding: 0px; margin: 0px;">
            <app-staff-duty-responsibility-list
              [staffNo]="selectedStaff?.staffNo">
            </app-staff-duty-responsibility-list>
          </div>
        </nz-collapse-panel>
      </nz-collapse>
    </div>

    <div>
      <nz-tabset [nzAnimated]="false">
        <nz-tab nzTitle="연락처">
          <div class="tab-grid">
            <app-staff-contact-form
              [staff]="selectedStaff"
              (formSaved)="selectGridAppointment()"
              (formDeleted)="selectGridAppointment()"
              (formClosed)="drawer.contact.visible = false">
            </app-staff-contact-form>
          </div>
        </nz-tab>

        <nz-tab nzTitle="발령기록">
          <button nz-button nzType="primary" (click)="newAppoint()">
            <span nz-icon nzType="save" nzTheme="outline"></span>발령등록
          </button>
          @defer (on idle) {
          <div class="tab-grid">
            <app-staff-appointment-record-grid
              [staffNo]="selectedStaff?.staffNo"
              (editButtonClicked)="editAppointment($event)"
              (rowDoubleClicked)="editAppointment($event)">
            </app-staff-appointment-record-grid>
          </div>
          }
        </nz-tab>

        <nz-tab nzTitle="가족">
          <button nz-button nzType="primary" (click)="newFamily()">
            <span nz-icon nzType="save" nzTheme="outline"></span>가족등록
          </button>
          @defer {
          <div class="tab-grid">
            <app-staff-family-grid
              [staffNo]="selectedStaff?.staffNo"
              (editButtonClicked)="editFamily($event)"
              (rowDoubleClicked)="editFamily($event)">
            </app-staff-family-grid>
          </div>
          }
        </nz-tab>

        <nz-tab nzTitle="학력">
          <button nz-button nzType="primary" (click)="newSchoolCareer()">
            <span nz-icon nzType="save" nzTheme="outline"></span>학력등록
          </button>
          @defer (on idle) {
          <div class="tab-grid">
            <app-staff-school-career-grid
              [staffNo]="selectedStaff?.staffNo"
              (editButtonClicked)="editSchoolCareer($event)"
              (rowDoubleClicked)="editSchoolCareer($event)">
            </app-staff-school-career-grid>
          </div>
          }
        </nz-tab>

        <nz-tab nzTitle="자격면허">
          <button nz-button nzType="primary" (click)="newLicense()">
            <span nz-icon nzType="save" nzTheme="outline"></span>자격면허등록
          </button>
          @defer (on idle) {
          <div class="tab-grid">
            <app-staff-license-grid
              [staffNo]="selectedStaff?.staffNo"
              (editButtonClicked)="editLicense($event)"
              (rowDoubleClicked)="editLicense($event)">
            </app-staff-license-grid>
          </div>
          }
        </nz-tab>

        <nz-tab nzTitle="카드명단">
        @defer (on idle) {
          <div class="tab-grid">
            <app-staff-card-list>
            </app-staff-card-list>
          </div>
        }
        </nz-tab>

      </nz-tabset>
    </div>

  </div>
</app-shape>

<app-new-staff-form-drawer
  [drawer]="drawer.newStaff"
  (drawerClosed)="selectGridStaff()">
</app-new-staff-form-drawer>

<app-staff-appointment-record-form-drawer
  [drawer]="drawer.appointment"
  [selectedStaff]="selectedStaff"
  (drawerClosed)="selectGridAppointment()">
</app-staff-appointment-record-form-drawer>

<!-- (drawerClosed)="selectGridAppointment()" -->
<app-staff-duty-responsibility-form-drawer
  [drawer]="drawer.dutyResponsibility"
  [selectedStaff]="selectedStaff">
</app-staff-duty-responsibility-form-drawer>

<app-staff-duty-responsibility-form-drawer
  [drawer]="drawer.contact"
  [selectedStaff]="selectedStaff"
  (drawerClosed)="selectGridAppointment()">
</app-staff-duty-responsibility-form-drawer>

<app-staff-family-form-drawer
  [drawer]="drawer.family"
  [selectedStaff]="selectedStaff"
  (drawerClosed)="selectGridFaimly()">
</app-staff-family-form-drawer>

<app-staff-school-career-form-drawer
  [drawer]="drawer.schoolCareer"
  [selectedStaff]="selectedStaff"
  (drawerClosed)="selectGridSchoolCareer()">
</app-staff-school-career-form-drawer>

<app-staff-license-form-drawer
  [drawer]="drawer.license"
  [selectedStaff]="selectedStaff"
  (drawerClosed)="selectGridLicense()">

</app-staff-license-form-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.app-grid {
  height: calc(100% - 10px);
  display: grid;
  /*grid-auto-flow: column;*/
  grid-template-columns: 200px 400px 1fr;
  column-gap: 10px;
  margin-top: 10px;
}

.btn-group {
  padding: 6px;
  /*background: #fbfbfb;*/
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding-left: auto;
  padding-right: 5;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.tab-grid {
  height: calc(100vh - 334px);
}
  `
})
export class StaffManagementApp implements OnInit {

  gridStaff = viewChild.required(StaffGridComponent);
  formStaff = viewChild.required(StaffRegistFormComponent);
  staffDesc = viewChild.required(StaffCurrentAppointmentDescriptionComponent);
  gridAppointment = viewChild.required(StaffAppointmentRecordGridComponent);
  gridFamily = viewChild.required(StaffFamilyGridComponent);
  gridLicense = viewChild.required(StaffLicenseGridComponent);
  gridSchoolcareer = viewChild.required(StaffSchoolCareerGridComponent);

  selectedStaff?: {companyCode: string, staffNo: string, staffName: string};

  drawer: {
    newStaff: { visible: boolean, formDataId: any },
    appointment: { visible: boolean, formDataId: any },
    dutyResponsibility: { visible: boolean, formDataId: any },
    contact: { visible: boolean, formDataId: any },
    family: { visible: boolean, formDataId: any },
    schoolCareer: { visible: boolean, formDataId: any },
    license: { visible: boolean, formDataId: any }
  } = {
    newStaff: { visible: false, formDataId: null },
    appointment: { visible: false, formDataId: null },
    dutyResponsibility: { visible: false, formDataId: null },
    contact: { visible: false, formDataId: null },
    family: { visible: false, formDataId: null },
    schoolCareer: { visible: false, formDataId: null },
    license: { visible: false, formDataId: null }
  }

  constructor() {
  }

  ngOnInit() {
  }

  staffGridRowClicked(params: any) {
    this.selectedStaff = {companyCode: params.companyCode, staffNo: params.staffNo, staffName: params.name};
    this.formStaff().get(params.staffNo);
  }

  selectGridStaff() {
    this.drawer.newStaff.visible = false;

    this.gridStaff().gridResource.reload();
  }

  newStaff() {
    this.drawer.newStaff.visible = true;
  }

  newAppoint() {
    this.drawer.appointment.visible = true;
  }

  newDutyResponsibility() {
    this.drawer.dutyResponsibility.visible = true;
  }

  newContact() {
    this.drawer.contact.visible = true;
  }

  selectGridAppointment() {
    this.drawer.appointment.visible = false;
    //this.gridAppointment().getList(this.selectedStaff?.staffNo!);
    this.gridAppointment().gridResource.reload();
    this.staffDesc().get(this.selectedStaff?.staffNo!);
  }

  editAppointment(row: StaffAppointmentRecord) {
    this.drawer.appointment.formDataId = {staffId: row.staffNo, seq: row.seq};
    this.drawer.appointment.visible = true;
  }

  selectGridFaimly() {
    this.drawer.family.visible = false;
    this.gridFamily().gridResource.reload();
  }

  newFamily() {
    this.drawer.family.visible = true;
  }

  editFamily(row: StaffFamily) {
    this.drawer.family.formDataId = {staffId: row.staffNo, seq: row.seq};
    this.drawer.family.visible = true;
  }

  selectGridSchoolCareer() {
    this.drawer.schoolCareer.visible = false;
    this.gridSchoolcareer().gridResource.reload();
  }

  newSchoolCareer() {
    this.drawer.schoolCareer.visible = true;
  }

  editSchoolCareer(row: StaffSchoolCareer) {
    this.drawer.schoolCareer.formDataId = {staffId: row.staffNo, seq: row.seq};
    this.drawer.schoolCareer.visible = true;
  }

  selectGridLicense() {
    this.drawer.license.visible = false;
    this.gridLicense().gridResource.reload();
  }

  newLicense() {
    this.drawer.license.visible = true;
  }

  editLicense(row: StaffLicense) {
    this.drawer.license.formDataId = {staffId: row.staffNo, seq: row.seq};
    this.drawer.license.visible = true;
  }

}
