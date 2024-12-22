import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { UserSessionService } from 'src/app/core/service/user-session.service';
import { AppAlarmService } from 'src/app/core/service/app-alarm.service';
import { AppLayoutService } from './app-layout.service';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { UserProfileComponent } from 'src/app/app-layout/user-profile/user-profile.component';
import { SideMenuComponent } from 'src/app/app-layout/side-menu/side-menu.component';

@Component({
  selector: 'app-app-layout',
  imports: [
    RouterModule,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzIconModule,
    NzSelectModule,
    NzDropDownModule,
    UserProfileComponent,
    SideMenuComponent
 ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit  {

  profileAvatarSrc: string = '';

  menuGroupInfo: {list: {menuGroupCode: string, menuGroupName: string, menuGroupUrl: string}[], selectedId: string} = {
    list: [],
    selectedId: ''
  }

  // 기본 SIDER 메뉴 트리거 숨기기위해 사용
  triggerTemplate: TemplateRef<void> | null = null;

  footerMessage: string = '';

  sideMenu : {menuGroupCode: string, url: string, isCollapsed: boolean} = {menuGroupCode: '', url: '', isCollapsed: false};

  private appAlarmService = inject(AppAlarmService);
  private sessionService = inject(UserSessionService);
  private service = inject(AppLayoutService);
  private router = inject(Router);

  ngOnInit(): void {
    this.appAlarmService.currentMessage.subscribe(message => this.footerMessage = message);

    this.setInitMenuGroup();
    this.setAvatar();
  }

  /**
   * 초기 메뉴 그룹을 설정한다.
   */
  setInitMenuGroup(): void {
    const stringMenuGroupList = sessionStorage.getItem('menuGroupList') as string;
    const sessionMenuGroup    = sessionStorage.getItem('selectedMenuGroup') as string;

    this.menuGroupInfo.list = JSON.parse(stringMenuGroupList);

    if (sessionMenuGroup) {
      this.menuGroupInfo.selectedId = sessionMenuGroup;
      this.sideMenu.menuGroupCode = sessionMenuGroup;

      this.moveToMenuGroupUrl(this.sideMenu.menuGroupCode);
      //const LAST_VISIT_URL = sessionStorage.getItem('selectedMenu') as string;
      //this.moveToUrl(LAST_VISIT_URL);

    } else {
      this.menuGroupInfo.selectedId = this.menuGroupInfo.list[0].menuGroupCode;
      this.moveToMenuGroupUrl(this.menuGroupInfo.selectedId);
    }
  }

  moveToMenuGroupUrl(menuGroupCode: string) {
    sessionStorage.setItem('selectedMenuGroup', menuGroupCode);
    this.sideMenu.menuGroupCode = menuGroupCode;

    this.router.navigate([this.getMenuGroupUrl(menuGroupCode)]);
  }

  moveToUrl(url: string) {
    this.sideMenu.url = url;
    this.router.navigate([url]);
  }

  setAvatar(): void {
    const profilePictureUrl: string | null = this.sessionService.getAvartarImageString();
    if (profilePictureUrl) {
      this.profileAvatarSrc = profilePictureUrl as string;
    }
  }

  getMenuGroupUrl(menuGroupCode: string) {
    for (const menuGroup of this.menuGroupInfo.list) {
      if (menuGroup.menuGroupCode === menuGroupCode) {
        return menuGroup.menuGroupUrl;
      }
    }
    return '';
  }

}
