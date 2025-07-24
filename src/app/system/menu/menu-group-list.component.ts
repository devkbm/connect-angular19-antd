import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';
import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { NzIconModule } from 'ng-zorro-antd/icon';


export interface MenuGroup {
  menuGroupCode: string | null;
  menuGroupName: string | null;
  menuGroupUrl: string | null;
  description: string | null;
  sequence: number | null;
}


@Component({
  selector: 'app-menu-group-list',
  imports: [
    CommonModule,
    NzListModule,
    NzIconModule
  ],
  template: `
    <ng-template #header>
      <nz-icon nzType="database" nzTheme="outline" />
      메뉴그룹 목록
    </ng-template>

    <ng-template #footer>
        메뉴그룹 : {{gridResource.value()?.data?.length}} 건
      </ng-template>

    <nz-list nzItemLayout="vertical" [nzHeader]="header" [nzFooter]="footer" >
      @for (item of gridResource.value()?.data; track item) {
        <nz-list-item nzNoFlex>
          <ng-container>
            <nz-list-item-meta>
              <nz-list-item-meta-title>
                {{item.menuGroupName}} [ {{item.menuGroupCode}} ]
              </nz-list-item-meta-title>

              <nz-list-item-meta-description>
                비고 : {{item.description}}
              </nz-list-item-meta-description>
            </nz-list-item-meta>

            메뉴그룹 URL : {{item.menuGroupUrl}} <br/>
            순번 : {{item.sequence}}

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
export class MenuGroupListComponent {
  editButtonClicked = output<MenuGroup>();

  private http = inject(HttpClient);

  gridQuery = signal<any>('');
  gridResource = rxResource({
    request: () => this.gridQuery(),
    loader: ({request}) => this.http.get<ResponseList<MenuGroup>>(
      GlobalProperty.serverUrl() + `/api/system/menugroup`,
      getHttpOptions(request)
    )
  })

  onEditButtonClick(rowData: MenuGroup) {
    this.editButtonClicked.emit(rowData);
  }

}
