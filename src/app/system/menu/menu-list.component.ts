import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';
import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface Menu {
  menuGroupCode: string | null;
  menuCode: string | null;
  menuName: string | null;
  menuType: string | null;
  parentMenuCode: string | null;
  sequence: number | null;
  appUrl: string | null;
  appIconType: string | null;
  appIcon: string | null;
}


@Component({
  selector: 'app-menu-list',
  imports: [
    CommonModule,
    NzListModule,
    NzIconModule
  ],
  template: `
    <ng-template #header>
      <nz-icon nzType="database" nzTheme="outline" />
      메뉴 목록
    </ng-template>

    <ng-template #footer>
        메뉴 : {{gridResource.value()?.data?.length}} 건
      </ng-template>

    <nz-list nzItemLayout="vertical" [nzHeader]="header" [nzFooter]="footer" >
      @for (item of gridResource.value()?.data; track item) {
        <nz-list-item nzNoFlex>
          <ng-container>
            <nz-list-item-meta>
              <nz-list-item-meta-title>
                {{item.menuName}} [ {{item.menuCode}} ]
              </nz-list-item-meta-title>

              <nz-list-item-meta-description>
                메뉴타입 : {{item.menuType}}
              </nz-list-item-meta-description>
            </nz-list-item-meta>

            상위메뉴코드 : {{item.parentMenuCode}} <br/>
            URL : {{item.appUrl}} <br/>
            Icon : {{item.appIcon}} <br/>

            <ul nz-list-item-actions>
              <nz-list-item-action>
                <a (click)="onEditButtonClick(item)"><nz-icon nzType="form" nzTheme="outline"/> edit</a>
              </nz-list-item-action>
            </ul>
          </ng-container>
        </nz-list-item>
      }
    </nz-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuListComponent {
  editButtonClicked = output<Menu>();

  private http = inject(HttpClient);

  gridQuery = signal<any>('');
  gridResource = rxResource({
    request: () => this.gridQuery(),
    loader: ({request}) => this.http.get<ResponseList<Menu>>(
      GlobalProperty.serverUrl() + `/api/system/menu`,
      getHttpOptions(request)
    )
  })

  onEditButtonClick(rowData: Menu) {
    this.editButtonClicked.emit(rowData);
  }
}
