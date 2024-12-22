import { Component, inject, effect, input } from '@angular/core';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzFileUploadComponent } from 'src/app/third-party/ng-zorro/nz-file-upload/nz-file-upload.component';
import { TrustHtmlPipe } from "src/app/core/pipe/trust-html.pipe";

import { ResponseObject } from 'src/app/core/model/response-object';
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { SessionManager } from 'src/app/core/session-manager';
import { NzFileDownloadComponent } from 'src/app/third-party/ng-zorro/nz-file-download/nz-file-download.component';
import { ArticleFileUploadComponent } from './article-file-upload.component';

@Component({
  selector: 'app-article-view',
  imports: [
    TrustHtmlPipe,
    NzPageHeaderModule,
    NzFileUploadComponent,
    NzFileDownloadComponent,
    ArticleFileUploadComponent
  ],
  template: `
<nz-page-header nzTitle="제목" [nzSubtitle]="article?.title">
  <nz-page-header-content>
      {{article?.fromDate}}
  </nz-page-header-content>
</nz-page-header>
첨부파일 <br/>
<!--<app-nz-file-upload [fileList]="fileList"></app-nz-file-upload>-->
<app-nz-file-download [fileList]="fileList" [height]="'100px'"></app-nz-file-download>

<app-article-file-upload
  [isUploadBtnVisible]="false"
  [(uploadedFileList)]="fileList">
</app-article-file-upload>

<div [innerHTML]="article?.contents | trustHtml"></div>
  `,
  styles: `
nz-page-header {
  border: 1px solid rgb(235, 237, 240);
}
  `
})
export class ArticleViewComponent {

  private service= inject(ArticleService);

  id = input<string>();

  article: Article | null = null;
  fileList: any = [];

  constructor() {
    effect(() => {
      if (this.id()) {
        console.log(this.id());
        this.get(this.id());
      }
    })
  }

  get(id: any): void {
    this.service
        .getArticle(id)
        .subscribe(
          (model: ResponseObject<Article>) => {
            if (model.data) {
              this.article = model.data;
              this.fileList = model.data.fileList;

              this.updateHitCount(this.article.articleId, SessionManager.getUserId());
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
