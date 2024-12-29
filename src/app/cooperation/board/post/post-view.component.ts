import { Component, inject, effect, input } from '@angular/core';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzFileUploadComponent } from 'src/app/third-party/ng-zorro/nz-file-upload/nz-file-upload.component';
import { TrustHtmlPipe } from "src/app/core/pipe/trust-html.pipe";

import { ResponseObject } from 'src/app/core/model/response-object';
import { PostService } from './post.service';
import { Post } from './post.model';
import { SessionManager } from 'src/app/core/session-manager';
import { NzFileDownloadComponent } from 'src/app/third-party/ng-zorro/nz-file-download/nz-file-download.component';
import { PostFileUploadComponent } from './post-file-upload.component';

@Component({
  selector: 'app-post-view',
  imports: [
    TrustHtmlPipe,
    NzPageHeaderModule,
    NzFileUploadComponent,
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
export class ArticleViewComponent {

  private service= inject(PostService);

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
    this.service
        .get(id)
        .subscribe(
          (model: ResponseObject<Post>) => {
            if (model.data) {
              this.post = model.data;
              this.fileList = model.data.fileList;

              this.updateHitCount(this.postId(), SessionManager.getUserId());
            }
          }
        );
  }

  updateHitCount(id: any, userId: any) {
    this.service
        .updateHitCount(id, userId)
        .subscribe(
          (model: ResponseObject<void>) => {

          }
        );
  }

}
