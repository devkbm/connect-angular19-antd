import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { UserSessionService } from 'src/app/core/service/user-session.service';
import { NotifyService } from 'src/app/core/service/notify.service';


import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { UserProfileComponent } from 'src/app/app-layout/user-profile/user-profile.component';
import { SideMenuComponent } from 'src/app/app-layout/side-menu/side-menu.component';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from '../core/global-property';
import { getHttpOptions } from '../core/http/http-utils';
import { ResponseList } from '../core/model/response-list';
import { catchError, combineLatest, of, switchMap } from 'rxjs';

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
  template: `
<nz-layout>

  <nz-sider
    class="sidebar"
    nzCollapsible
    [(nzCollapsed)]="sideMenu.isCollapsed"
    [nzCollapsedWidth]="0"
    [nzWidth]="200"
    [nzTrigger]="triggerTemplate">
      <app-side-menu class="sidebar" [menuGroupCode]="sideMenu.menuGroupCode" [menuUrl]="sideMenu.url">
      </app-side-menu>
  </nz-sider>

  <nz-layout>
    <nz-header class="header">
      <span nz-icon class="collapse-icon" [nzType]="sideMenu.isCollapsed ? 'menu-unfold' : 'menu-fold'" (click)="sideMenu.isCollapsed=!sideMenu.isCollapsed"></span>

      <nz-select
        class="sidemenugroup"
        nzShowSearch
        [(ngModel)]="menuGroupInfo.selectedId"
        (ngModelChange)="moveToMenuGroupUrl($event)">
          @for (menuGroup of menuGroupInfo.list; track menuGroup.menuGroupCode) {
            <nz-option
              [nzValue]="menuGroup.menuGroupCode"
              [nzLabel]="menuGroup.menuGroupName">
            </nz-option>
          }
      </nz-select>
      
      <button (click)="test()">ddd</button>            

      <nz-avatar class="avatar" nzShape="square" [nzSize]='48' [nzSrc]="profileAvatarSrc" nz-dropdown [nzDropdownMenu]="menu" nzTrigger="click">
        <nz-dropdown-menu #menu="nzDropdownMenu">
          프로필 정보
          <app-user-profile></app-user-profile>
        </nz-dropdown-menu>
      </nz-avatar>
    </nz-header>


    <nz-content class="main-content">
      <router-outlet></router-outlet>
    </nz-content>

    <!--
    <div class="footer">
      {{footerMessage}}
    </div>
    -->
  </nz-layout>
</nz-layout>
  `,
  styles: `
.logo {
  display: flex;
  /*위에서 아래로 수직 배치*/
  flex-direction: column;
  /*중앙정렬*/
  justify-content: center;
  text-align: center;
  width: 200px;
  height: 64px;

  background-color: darkslategray;
  color: white;
  font-weight: 300;
  font-size: 30px;
  line-height: 0.6;
  font-family: 'Bangers', cursive;
  letter-spacing: 5px;
  text-shadow: 5px 2px #222324, 2px 4px #222324, 3px 5px #222324;
}

.sidebar {
  background: black;
  height: calc(100vh - 64px);
  /* text 드래그 막기 */
  -webkit-touch-callout: none;  /* iOS Safari */
  -webkit-user-select: none;    /* Safari */
  -khtml-user-select: none;     /* Konqueror HTML */
  -moz-user-select: none;       /* Old versions of Firefox */
  -ms-user-select: none;        /* Internet Explorer/Edge */
  user-select: none;            /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.header {
  height: var(--app-header-height);
  padding: 0;
  margin: 0;
  align-content: center;
  vertical-align: middle;
}

.collapse-icon {
  margin-top: 16px;
  margin-left: 5px;
  font-size: 24px;
  color:rgb(185, 173, 159);
  vertical-align: top;
}

.sidemenugroup {
  width: 150px;
  margin-right: 10px;
  margin-left: 10px;
}

.avatar {
  float: right;
  margin-top: 8px;
  margin-right: 20px;
  vertical-align: top;
}

.main-content {
  margin-top: var(--app-content-margin-height);
  margin-right: 12px;
  margin-bottom: 0px;
  margin-left: 12px;
  background-color: black;
  /* 헤더, 본문 margin, 푸터를 제외한 높이로 설정 */
  height: calc(100vh - (var(--app-header-height) + var(--app-content-margin-height) + var(--app-footer-height)));
  width: auto;
  /*overflow-y: hidden;*/
}

.footer {
  position: sticky;
  margin: 0px;
  height: var(--app-footer-height);
  text-align: center;
  vertical-align: middle;
  background-color: black;
}

.menu {
  height: 100%;
}

  `
})
export class AppLayoutComponent implements OnInit  {

  profileAvatarSrc: string | undefined;

  menuGroupInfo: {list: {menuGroupCode: string, menuGroupName: string, menuGroupUrl: string}[], selectedId: string} = {
    list: [],
    selectedId: ''
  }

  // 기본 SIDER 메뉴 트리거 숨기기위해 사용
  triggerTemplate: TemplateRef<void> | null = null;

  footerMessage: string = '';

  sideMenu : {menuGroupCode: string, url: string, isCollapsed: boolean} = {menuGroupCode: '', url: '', isCollapsed: false};

  private notifyService = inject(NotifyService);
  private sessionService = inject(UserSessionService);
  private router = inject(Router);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.notifyService.currentMessage.subscribe(message => this.footerMessage = message);

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

  test(): void {
    const url = GlobalProperty.serverUrl + `/api/system/user/auth1`;
    const options = getHttpOptions();

    this.http.get<ResponseList<any>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseList<any>) => {
        console.log(model);
      }
    );
  }

  logout() {
    const url1 = GlobalProperty.serverUrl + `/api/system/user/auth1`;
    const url2 = GlobalProperty.serverUrl + `/api/system/user/logout`;
    const options = getHttpOptions();

    this.http.get<any>(url1, options).pipe(
      switchMap(res => {
        //console.log(res.authenticated);
        if (res.authenticated) {
          return this.http.get<ResponseList<boolean>>(url2, options);
        } else {
          return of(false);
        }
      }),
      catchError((err) => { return of(false) })
    )
    .subscribe(logout => {
      this.router.navigate(['/login']);
    });
  }

  logout2() {
    /*
    const url = GlobalProperty.serverUrl + `/api/system/user/logout`;
    const options = getHttpOptions();

    this.http.get<ResponseList<any>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseList<any>) => {
        console.log(model);
        this.router.navigate(['/login']);
      }
    );
    */

    const url1 = GlobalProperty.serverUrl + `/api/system/user/auth1`;
    const url2 = GlobalProperty.serverUrl + `/api/system/user/logout`;
    const options = getHttpOptions();

    const auth = this.http.get<ResponseList<any>>(url1, options).pipe(

    );
    const out = this.http.get<ResponseList<any>>(url2, options).pipe(
      //catchError((err) => Observable.throw(err))
    );

    combineLatest([auth, out]).subscribe(
      (model: ResponseList<any>[]) => {
        console.log(model);
        //this.router.navigate(['/login']);
      }
    );
  }

}
