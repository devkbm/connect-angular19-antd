import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadModule, FileUploader } from 'ng2-file-upload';

import { GlobalProperty } from 'src/app/core/global-property';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface UploadedFile {
  uid: string;
  name: string;
  size: number;
	contentType: string;
  status: string;
  response: string;
  url: string;
}

@Component({
  selector: 'app-post-file-upload',
  imports: [
    CommonModule,
    FileUploadModule,
    NzIconModule
  ],
  template: `
<!--
<input type="file" ng2FileSelect [uploader]="uploader"/> <button (click)="upload()">업로드</button>
@for (item of uploader.queue; track item) {
  <td><strong>{{ item?.file?.name }}</strong></td>
}
-->

<style>
  .my-drop-zone { border: dotted 3px lightgray; }
  .nv-file-over { border: dotted 3px red; } /* Default class applied to drop zones on over */
  .another-file-over-class { border: dotted 3px green; }

  html, body { height: 100%; }
</style>

<div class="container">
  <!--{{this.uploadedFileList() | json}}-->

  <div class="row">
    @if (isUploadBtnVisible()) {
      <div class="col-md-3">
        <label for="input-file" class="input-file-button">파일첨부</label>
        <input id="input-file" type="file" ng2FileSelect [uploader]="uploader" multiple style="display:none"/>
      </div>
    }

    <div class="col-md-9" style="margin-bottom: 40px">
      <p>파일 개수 : {{ uploader.queue.length + this.uploadedFileList().length }}</p>

      <table class="table">
        <thead>
          <tr>
            <th width="50%">Name</th>
            <th width="50%">Size</th>
            <!--
            <th>Progress</th>
            <th>Status</th>
            <th>Actions</th>
            -->
          </tr>
        </thead>

        <tbody>
          @for (file of this.uploadedFileList(); track file.uid) {
          <tr>
            <td><a [href]="file.url" download> {{file.name}}</a></td>
            <td style="text-align: right">{{ file.size/1024/1024 | number:'.2' }} MB</td>
          </tr>
          }

          @for (item of uploader.queue; track item) {
          <tr>
            <td><strong>{{ item?.file?.name }}</strong></td>
            <td style="text-align: right">{{ item?.file?.size/1024/1024 | number:'.2' }} MB</td>

            <!--
            <td>
              <div class="progress" style="margin-bottom: 0;">
                <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': item.progress + '%' }"></div>
              </div>
            </td>

            <td class="text-center">
              @if (item.isSuccess) {
                <span><i class="glyphicon glyphicon-ok"></i></span>
              }
              @if (item.isCancel) {
                <span><i class="glyphicon glyphicon-ban-circle"></i></span>
              }
              @if (item.isError) {
                <span><i class="glyphicon glyphicon-remove"></i></span>
              }
            </td>
            <td nowrap>
              <button type="button" class="btn btn-success btn-xs"
                (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">
                <span class="glyphicon glyphicon-upload"></span> Upload
              </button>
              <button type="button" class="btn btn-warning btn-xs"
                (click)="item.cancel()" [disabled]="!item.isUploading">
                <span class="glyphicon glyphicon-ban-circle"></span> Cancel
              </button>
              <button type="button" class="btn btn-danger btn-xs"
                (click)="item.remove()">
                <span class="glyphicon glyphicon-trash"></span> Remove
              </button>
            </td>
          -->
          </tr>
          }
        </tbody>
      </table>

      <!--
      <div>
        <div>
          Queue progress:
          <div class="progress" style="">
            <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': uploader.progress + '%' }"></div>
          </div>
        </div>
        <button type="button" class="btn btn-success btn-s"
          (click)="uploader.uploadAll()" [disabled]="!uploader.getNotUploadedItems().length">
          <span class="glyphicon glyphicon-upload"></span> Upload all
        </button>
        <button type="button" class="btn btn-warning btn-s"
          (click)="uploader.cancelAll()" [disabled]="!uploader.isUploading">
          <span class="glyphicon glyphicon-ban-circle"></span> Cancel all
        </button>
        <button type="button" class="btn btn-danger btn-s"
          (click)="uploader.clearQueue()" [disabled]="!uploader.queue.length">
          <span class="glyphicon glyphicon-trash"></span> Remove all
        </button>
      </div>
      -->

    </div>

  </div>

</div>
  `,
  styles: `
    .table {
      width: 100%;
      table-layout: fixed;
      background-color: blue;
    }

    .input-file-button {
      padding: 6px 25px;
      background-color:#FF6600;
      border-radius: 4px;
      color: white;
      cursor: pointer;
    }
  `
})
export class PostFileUploadComponent {

  uploadUrl: string = GlobalProperty.serverUrl + '/api/system/file';
  uploader: FileUploader;

  isUploadBtnVisible = input<boolean>(true);

  uploadedFileList = model<UploadedFile[]>([]);
  uploadCompleted = output<UploadedFile[]>();

  constructor() {

    this.uploader = new FileUploader({
      url: this.uploadUrl,
      authToken: sessionStorage.getItem('token')!,
    });

    this.uploader.response.subscribe( (res: any) => {
      // 개별 파일로 업로드 처리되어 첫번째 response 데이터만 리스트에 추가
      this.uploadedFileList().push(JSON.parse(res)[0]);
    });

    this.uploader.onCompleteAll = () => {
      //console.log('업로드 완료');
      this.uploadCompleted.emit(this.uploadedFileList());
    };
  }

  upload() {
    this.uploader.uploadAll();
  }

  isUpload(): boolean {
    return this.uploader.queue.length > 0 ? true : false;
  }

}