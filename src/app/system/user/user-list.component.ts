import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';

import { ResponseList } from 'src/app/core/model/response-list';

import { User } from './user.model';
import { GlobalProperty } from 'src/app/core/global-property';
import { HttpClient } from '@angular/common/http';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { rxResource } from '@angular/core/rxjs-interop';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    NzListModule
  ],
  template: `
     <nz-list nzBordered nzHeader="Header" nzFooter="Footer" nzItemLayout="vertical">
      @for (item of gridResource.value()?.data; track item) {
        <nz-list-item>
          <ng-container>

            <nz-list-item-meta>
              <nz-list-item-meta-avatar nzSrc="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png">
              </nz-list-item-meta-avatar>
              <nz-list-item-meta-title>
                TITLE
              </nz-list-item-meta-title>
              <nz-list-item-meta-description>
                desc11111111111111111111111111111111111
              </nz-list-item-meta-description>
              asfs
            </nz-list-item-meta>

            <!--{{ item | json }}-->
             content11111213123123213231123213213

            <ul nz-list-item-actions>
              <nz-list-item-action><a (click)="msg.info('edit')">edit</a></nz-list-item-action>
              <nz-list-item-action><a (click)="msg.info('edit')">more</a></nz-list-item-action>
            </ul>
          </ng-container>

           <nz-list-item-extra>
            <!--<img width="272" alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />-->
            asfasfsafasfaasf    <br>
            sdlkfjsldfkjsfdlkj  <br>
            lkdfkljdsflsdfkj    <br>
          </nz-list-item-extra>
        </nz-list-item>
      }
    </nz-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {

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


}
