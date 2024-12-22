import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResponseList } from 'src/app/core/model/response-list';

import { MenuGroup } from '../menu/menu-group.model';
import { Role } from '../role/role.model';
import { UserService } from '../user/user.service';
import { MenuService } from '../menu/menu.service';
import { MenuGroupGridComponent } from '../menu/menu-group-grid.component';
import { RoleGridComponent } from '../role/role-grid.component';
import { RoleFormComponent } from '../role/role-form.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MenuGridComponent } from '../menu/menu-grid.component';
import { MenuFormComponent } from '../menu/menu-form.component';
import { MenuGroupFormComponent } from '../menu/menu-group-form.component';
import { MenuRoleTreeComponent } from './menu-role-tree.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';


@Component({
  selector: 'app-menu-role',
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzButtonModule,
    NzDrawerModule,
    NzFormItemCustomComponent,
    NzInputSelectComponent,
    MenuGroupGridComponent,
    MenuGroupFormComponent,
    MenuGridComponent,
    MenuFormComponent,
    RoleGridComponent,
    RoleFormComponent,
    MenuRoleTreeComponent
  ],
  template: `
    <button nz-button (click)="newRole()">신규 롤</button>
    <button nz-button (click)="newMenuGroup()">신규 메뉴그룹</button>
    <button nz-button (click)="newMenu()">신규 메뉴</button>
    <div nz-col nzSpan="12">
      <nz-form-item-custom for="menuGroup" label="메뉴그룹">
        <nz-form-control>
          <nz-input-select
            [(ngModel)]="menuGroup.selectedItem" itemId="menuGroup"
            [options]="menuGroup.list" [opt_value]="'menuGroupCode'" [opt_label]="'menuGroupName'"
            placeholder="Please select">
          </nz-input-select>
        </nz-form-control>
      </nz-form-item-custom>
    </div>

    <div nz-col nzSpan="12">
      <nz-form-item-custom for="roleCode" label="롤">
        <nz-form-control>
          <nz-input-select
            [(ngModel)]="role.selectedItem" itemId="roleCode"
            [options]="role.list" [opt_value]="'roleCode'" [opt_label]="'description'"
            placeholder="Please select">
          </nz-input-select>
        </nz-form-control>
      </nz-form-item-custom>
    </div>

    <div class="page-content">
      @defer {
      <app-menu-group-grid class="grid1"
        (rowClicked)="menuGroupClicked($event)"
        (editButtonClicked)="editMenuGroup($event)"
        (rowDoubleClicked)="editMenuGroup($event)">
      </app-menu-group-grid>
      }
      @defer {
      <app-menu-grid class="grid2"
        (rowClicked)="menuClicked($event)"
        (editButtonClicked)="editMenu($event)"
        (rowDoubleClicked)="editMenu($event)">
      </app-menu-grid>
      }
      <app-role-grid class="grid3"
        (rowClicked)="roleClicked($event)"
        (editButtonClicked)="editRole($event)"
        (rowDoubleClicked)="editRole($event)">
      </app-role-grid>

      <app-menu-role-tree class="tree"
        [menuGroupCode]="menuGroup.selectedItem"
        [roleCode]="role.selectedItem">
      </app-menu-role-tree>
    </div>


    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px'}"
      [nzMaskClosable]="true"
      [nzWidth]="720"
      [nzVisible]="drawer.role.visible"
      nzTitle="롤 등록"
      (nzOnClose)="closeDrawer('role')">
        <app-role-form #form *nzDrawerContent
          [initLoadId]="drawer.role.initLoadId"
          (formSaved)="getRoleList()"
          (formDeleted)="getRoleList()"
          (formClosed)="closeDrawer('role')">
        </app-role-form>
    </nz-drawer>

    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      nzWidth="80%"
      [nzVisible]="drawer.menuGroup.visible"
      nzTitle="메뉴그룹 등록"
      (nzOnClose)="drawer.menuGroup.visible = false">
        <app-menu-group-form #menuGroupForm *nzDrawerContent
          [initLoadId]="drawer.menuGroup.initLoadId"
          (formSaved)="getMenuGroupList()"
          (formDeleted)="getMenuGroupList()"
          (formClosed)="drawer.menuGroup.visible = false">
        </app-menu-group-form>
    </nz-drawer>

    <nz-drawer
      [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
      [nzMaskClosable]="true"
      nzWidth="80%"
      [nzVisible]="drawer.menu.visible"
      nzTitle="메뉴 등록"
      (nzOnClose)="drawer.menu.visible = false">
        <app-menu-form #menuForm *nzDrawerContent
          [initLoadId]="drawer.menu.initLoadId"
          (formSaved)="getMenuList()"
          (formDeleted)="getMenuList()"
          (formClosed)="drawer.menu.visible = false">
        </app-menu-form>
    </nz-drawer>
  `,
  styles: `
  :host {
    --page-header-height: 98px;
    --page-search-height: 46px;
    --page-content-title-height: 26px;
    --page-content-title-margin-height: 6px;
    --page-content-margin-height: 6px;
  }

  .page-header {
    height: var(--page-header-height);
  }

  .page-search {
    height: var(--page-search-height);
  }

  .page-content-title {
    height: var(--page-content-title-height);
  }

  .page-content {
    margin-top: var(--page-content-margin-height);
    height: calc(100vh - (
                          var(--app-header-height) +
                          var(--app-footer-height) +
                          var(--page-header-height) +
                          var(--page-search-height) +
                          var(--page-content-margin-height)
                        )
                );
    /*height: 900px;*/
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 0.6fr 0.4fr;
    column-gap: 12px;
    row-gap: 12px;
    grid-template-areas:
      "grid1  grid3 tree"
      "grid2  grid3  tree";
  }

  .grid1 {
    grid-area: grid1;
  }

  .grid2 {
    grid-area: grid2;
  }

  .grid3 {
    grid-area: grid3;
  }

  .tree {
    grid-area: tree;
  }

  `
})
export class MenuRoleComponent {

  menuGroup: {list: any, selectedItem: string} = {list: [], selectedItem: ''};
  role: {list: any, selectedItem: string} = {list: [], selectedItem: ''};

  private menuService = inject(MenuService);
  private userService = inject(UserService);

  roleGrid = viewChild.required(RoleGridComponent);
  menuGroupGrid = viewChild.required(MenuGroupGridComponent);
  menuGrid = viewChild.required(MenuGridComponent);

  drawer: {
    menuGroup: { visible: boolean, initLoadId: any },
    menu: { visible: boolean, initLoadId: any },
    role: { visible: boolean, initLoadId: any }
  } = {
    menuGroup: { visible: false, initLoadId: null },
    menu: { visible: false, initLoadId: null },
    role: { visible: false, initLoadId: null }
  }

  constructor() {
    this.getMenuGroupList();
    this.getRoleList();
  }

  getMenuGroupList(): void {
    this.menuService
        .getMenuGroupList()
        .subscribe(
          (model: ResponseList<MenuGroup>) => {
            if (model.data) {
              this.menuGroup.list = model.data;
            }
          }
        );
  }

  getRoleList(): void {
    this.userService
        .getAuthorityList()
        .subscribe(
          (model: ResponseList<Role>) => {
            if (model.data) {
              this.role.list = model.data;
            }
          }
        );
  }

  openDrawer(type: 'role' | 'menuGroup' | 'menu') {
    switch (type) {
      case 'role':
        this.drawer.role.visible = true;
        break;
      case 'menuGroup':
        this.drawer.menuGroup.visible = true;
        break;
      case 'menu':
        this.drawer.menu.visible = true;
        break;
    }
  }

  closeDrawer(type: 'role' | 'menuGroup' | 'menu') {
    switch (type) {
      case 'role':
        this.drawer.role.visible = false;
        break;
      case 'menuGroup':
        this.drawer.menuGroup.visible = false;
        break;
      case 'menu':
        this.drawer.menu.visible = false;
        break;
    }
  }

  //#region MenuGroup
  menuGroupClicked(args: any) {
    this.menuGroup.selectedItem = args.menuGroupCode;
    this.drawer.menuGroup.initLoadId = args.menuGroupCode;
    this.role.selectedItem = '';
    this.roleGrid().getList({menuGroupCode: this.menuGroup.selectedItem});

    this.getMenuList();
  }

  newMenuGroup() {
    this.drawer.menuGroup.initLoadId = null;
    this.openDrawer('menuGroup');
  }

  editMenuGroup(args: any) {
    this.openDrawer('menuGroup');
  }
  //#endregion

  //#region Menu
  getMenuList() {
    this.menuGrid().getMenuList({menuGroupCode: this.menuGroup.selectedItem});
  }

  menuClicked(args: any) {
    this.drawer.menu.initLoadId = {menuGroupCode: args.menuGroupCode, menuCode: args.menuCode};
  }

  newMenu() {
    this.drawer.role.initLoadId = null;
    this.openDrawer('menu');
  }

  editMenu(args: any) {
    this.drawer.menu.initLoadId = {menuGroupCode: args.menuGroupCode, menuCode: args.menuCode};
    this.openDrawer('menu');
  }
  //#endregion

  //#region Role
  roleClicked(args: any) {
    this.role.selectedItem = args.roleCode;
    this.drawer.role.initLoadId = args.roleCode;
  }

  newRole() {
    this.drawer.role.initLoadId = null;
    this.openDrawer('role');
  }

  editRole(args: any) {
    this.openDrawer('role');
  }
  //#endregion

}
