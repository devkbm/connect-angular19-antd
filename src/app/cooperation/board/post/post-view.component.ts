import { Component, inject, effect, input } from '@angular/core';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { TrustHtmlPipe } from "src/app/core/pipe/trust-html.pipe";

import { ResponseObject } from 'src/app/core/model/response-object';
import { Post } from './post.model';
import { SessionManager } from 'src/app/core/session-manager';
import { NzFileDownloadComponent } from 'src/app/third-party/ng-zorro/nz-file-download/nz-file-download.component';
import { PostFileUploadComponent } from './post-file-upload.component';
import { HttpClient } from '@angular/common/http';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

@Component({
  selector: 'app-post-view',
  imports: [
    TrustHtmlPipe,
    NzPageHeaderModule,
    NzFileDownloadComponent,
    PostFileUploadComponent
  ],
  template: `
<nz-page-header nzTitle="제목" [nzSubtitle]="post?.title">
  <nz-page-header-content>
      {{post?.fromDate}}
  </nz-page-header-content>
</nz-page-header>
첨부파일 <br/>
<!--<app-nz-file-upload [fileList]="fileList"></app-nz-file-upload>-->
<app-nz-file-download [fileList]="fileList" [height]="'100px'"></app-nz-file-download>

<app-post-file-upload
  [isUploadBtnVisible]="false"
  [(uploadedFileList)]="fileList">
</app-post-file-upload>

<div [innerHTML]="post?.contents | trustHtml"></div>
  `,
  styles: `
nz-page-header {
  border: 1px solid rgb(235, 237, 240);
}
  `
})
export class PostViewComponent {

  private http = inject(HttpClient);

  postId = input<string>();

  post: Post | null = null;
  fileList: any = [];

  constructor() {
    effect(() => {
      console.log(this.postId());
      if (this.postId()) {
        this.get(this.postId());
      }
    })
  }

  get(id: any): void {
    const url = GlobalProperty.serverUrl + `/api/grw/board/post/${id}`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    }

    this.http
      .get<ResponseObject<Post>>(url, options)
      .pipe(
          // catchError((err) => Observable.throw(err))
      )
      .subscribe(
        (model: ResponseObject<Post>) => {
          if (model.data) {
            this.post = model.data;
            this.fileList = model.data.fileList;

            this.updateHitCount(this.postId(), SessionManager.getUserId());
          }
        }
      )
  }

  updateHitCount(id: any, userId: any) {
    const url = GlobalProperty.serverUrl + `/api/grw/board/post/hitcnt`;
    const param = {id: id, userId: userId};

    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: param
    };

    this.http
        .get<ResponseObject<void>>(url, options)
        .pipe(
          //catchError((err) => Observable.throw(err))
        )
        .subscribe(
          (model: ResponseObject<void>) => {

          }
        )

  }

}
