import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';

import { ResponseList } from 'src/app/core/model/response-list';

import { GlobalProperty } from 'src/app/core/global-property';
import { HttpClient } from '@angular/common/http';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { rxResource } from '@angular/core/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface User {
  userId: string | null;
  companyCode: string | null;
  staffNo: string | null;
  name: string | null;
  deptCode: string | null;
  deptName: string | null;
  mobileNum: string | null;
  email: string | null;
  imageBase64: string | null;
  enabled: boolean | null;
  roleList: string[] | null;
}

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    NzListModule
  ],
  template: `
     <nz-list nzItemLayout="vertical" nzHeader="Header" nzFooter="Footer" >
      @for (item of gridResource.value()?.data; track item) {
        <nz-list-item>
          <ng-container>

            <nz-list-item-meta>
              <nz-list-item-meta-avatar [nzSrc]="imageUrl(item)">
              </nz-list-item-meta-avatar>
              <nz-list-item-meta-title>
                {{item.name}} [ {{item.staffNo}} ]
              </nz-list-item-meta-title>
              <nz-list-item-meta-description>
                부서 : {{item.deptName}}
              </nz-list-item-meta-description>
            </nz-list-item-meta>
            핸드폰 번호 : {{item.mobileNum}} 이메일 : {{item.email}}

            <!--We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.-->

            <ul nz-list-item-actions>
              <nz-list-item-action><a (click)="onEditButtonClick(item)">edit</a></nz-list-item-action>
            </ul>
          </ng-container>

           <nz-list-item-extra style="width: 400px">
            {{item.roleList}}
          </nz-list-item-extra>
        </nz-list-item>
      }
    </nz-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {

  editButtonClicked = output<User>();

  private http = inject(HttpClient);

  msg = inject(NzMessageService);

  gridQuery = signal<any>('');
  gridResource = rxResource({
    request: () => this.gridQuery(),
    loader: ({request}) => this.http.get<ResponseList<User>>(
      GlobalProperty.serverUrl() + `/api/system/user`,
      getHttpOptions(request)
    )
  })

  onEditButtonClick(rowData: User) {
    this.editButtonClicked.emit(rowData);
  }

  imageUrl(rowData: User) {
    return GlobalProperty.serverUrl() + rowData.imageBase64;
  }

}
