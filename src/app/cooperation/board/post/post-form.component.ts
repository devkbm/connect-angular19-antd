import { AfterViewInit, Component, ElementRef, Input, Renderer2, effect, inject, input, output, viewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadChangeParam, NzUploadComponent, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzFormItemCustomComponent } from "src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component";
import { NzCrudButtonGroupComponent } from 'src/app/third-party/ng-zorro/nz-crud-button-group/nz-crud-button-group.component';
import { NzInputCkeditorComponent } from 'src/app/third-party/ckeditor/nz-input-ckeditor.component';
import { NzFileUploadComponent } from 'src/app/third-party/ng-zorro/nz-file-upload/nz-file-upload.component';

import { ResponseObject } from 'src/app/core/model/response-object';
import { GlobalProperty } from 'src/app/core/global-property';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

//import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { PostService } from './post.service';
import { Post } from './post.model';
import { PostFileUploadComponent } from './post-file-upload.component';
import { SessionManager } from 'src/app/core/session-manager';


@Component({
  selector: 'app-post-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzFormItemCustomComponent,
    NzInputCkeditorComponent,
    NzCrudButtonGroupComponent,
    //NzFileUploadComponent,
    PostFileUploadComponent
  ],
  template: `
    {{fg.getRawValue() | json}}
    <!--{{fileList | json}}-->

    <form nz-form [formGroup]="fg" [nzLayout]="'vertical'" #form>

      <!-- ERROR TEMPLATE-->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
      </ng-template>

      <nz-form-item-custom for="title" label="메뉴코드" required>
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="title" formControlName="title" required
            placeholder="제목을 입력해주세요."
          />
        </nz-form-control>
      </nz-form-item-custom>

      <nz-form-item-custom for="contents" label="내용">
        <nz-form-control>
          @defer {
            <nz-input-ckeditor
              formControlName="contents"
              [itemId]="'contents'"
              [height]="'45vh'">
            </nz-input-ckeditor>
          }
        </nz-form-control>
      </nz-form-item-custom>

      <!--
      <app-nz-file-upload
        [fileList]="fileList">
      </app-nz-file-upload>
      -->

      <app-post-file-upload
        [postId]="this.fg.controls.postId.value!"
        [attachedFileList]="attachedFileList"
        [(uploadedFileList)]="uploadedfileList"
        (uploadCompleted)="save()">
      </app-post-file-upload>

    </form>

    <div class="footer">
      <app-nz-crud-button-group
        [searchVisible]="false"
        [isSavePopupConfirm]="false"
        (closeClick)="closeForm()"
        (saveClick)="beforeSave()"
        (deleteClick)="remove(fg.get('articleId')?.value)">
      </app-nz-crud-button-group>
    </div>

  `,
  styles: [`
    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
      z-index: 900;
    }

    :host ::ng-deep .ck-editor__editable {
      height: 45vh;
      color: black;
      /*min-height: calc(100% - 300px) !important;*/
    }

    :host ::ng-deep .upload-list-inline .ant-upload-list-item {
      float: left;
      width: 200px;
      margin-right: 8px;
    }

  `]
})
export class PostFormComponent implements AfterViewInit {
  //public Editor = ClassicEditor;

  private boardService= inject(PostService);
  private renderer = inject(Renderer2);

  editorConfig = {
    //plugins: [ Font ],
    toolbar: [ 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor','heading', '|', 'bold', 'italic' ]
  };

  attachedFileList: any = [];

  uploadedfileList: any = [
    /*{
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png'
    },

    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png'
    }*/
  ];

  imageUploadParam = { pgmId: 'board', appUrl:'asd' };
  fileUploadHeader: any;
  fileUploadUrl: any;

  textData: any;
  article!: Post;

  @Input() boardId!: string;

  formElement = viewChild.required<ElementRef>('form');

  upload = viewChild.required<NzUploadComponent>('upload');
  ckEditor = viewChild.required<CKEditorComponent>('ckEditor');

  uploader = viewChild.required(PostFileUploadComponent);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    boardId         : new FormControl<string | null>(null, { validators: [Validators.required] }),
    postId          : new FormControl<string | null>(null, { validators: [Validators.required] }),
    postParentId    : new FormControl<string | null>(null),
    userId          : new FormControl<string | null>(null),
    title           : new FormControl<string | null>(null, { validators: [Validators.required] }),
    contents        : new FormControl<string | null>(null),
    attachFile      : new FormControl<any>(null)
  });

  formInitId = input<string>('');

  constructor() {
    this.fileUploadUrl = GlobalProperty.serverUrl + '/common/file/';
    this.fileUploadHeader = {
      Authorization: sessionStorage.getItem('token')
      /*'Content-Type': 'multipart/form-data'*/
    };

    effect(() => {
      console.log(this.formInitId());
      if (this.formInitId()) {
        this.get(this.formInitId());
      } else {
        this.newForm(this.boardId);
      }
    })
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput() {
    this.renderer.selectRootElement('#title').focus();
  }

  newForm(boardId: any): void {
    this.fg.reset();
    this.fg.controls.boardId.setValue(boardId);

    this.fg.controls.userId.setValue(SessionManager.getUserId());
    this.uploadedfileList = [];
    this.textData = null;

    this.focusInput();
  }

  modifyForm(formData: Post): void {
    this.fg.reset();
    this.fg.patchValue(formData);

    // boardId, articleId는 base64로 암호화
    this.fg.controls.boardId.setValue(btoa(this.fg.controls.boardId.value!));
    this.fg.controls.postId.setValue(btoa(this.fg.controls.postId.value!));
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());

    // 팝업 호출한 경우 팝업 종료
    if (window.opener) {
      window.close();
    }

  }

  get(id: any): void {
    this.boardService.get(id)
        .subscribe(
          (model: ResponseObject<Post>) => {
            if (model.data) {
              this.article = model.data;

              this.modifyForm(model.data);
              this.attachedFileList = model.data.fileList;
              //this.ckEditor.writeValue(model.data.contents);
            } else {
              this.newForm(null);
            }
          }
        );
  }

  beforeSave() {
    if (this.uploader().isUpload()) {
      this.uploader().upload();
    } else {
      this.save();
    }

  }

  save(): void {

    this.convertFileList();

    this.boardService
        .saveArticleJson(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<Post>) => {
            //console.log(model);
            this.formSaved.emit(this.fg.getRawValue());
            console.log(window.opener);

            // 팝업 호출한 경우 재조회 후 팝업 종료
            if (window.opener) {
              window.opener.postMessage(this.boardId);
              window.close();
            }
          }
        );
  }

  remove(id: any): void {
    console.log(id);
    this.boardService.delete(id)
      .subscribe(
        (model: ResponseObject<Post>) => {
          this.formDeleted.emit(this.fg.getRawValue());

          // 팝업 호출한 경우 재조회 후 팝업 종료
          if (window.opener) {
            window.opener.postMessage(this.boardId);
            window.close();
          }
        }
      );
  }

  fileDown(): void {
    // this.boardService.downloadFile(this.article.attachFile[0].fileId, this.article.attachFile[0].fileName);
  }

  fileUploadChange(param: NzUploadChangeParam): void {
    console.log(param);
    if (param.type === 'success') {
      // this.fileList = param.file.response;
      this.uploadedfileList.push(param.file.response[0]);
    }
  }

  textChange({ editor }: ChangeEvent): void {

    //const data = editor.getData();
    //this.fg.get('contents')?.setValue(data);
  }

  convertFileList() {
    const attachFileIdList: any = [];

    if (this.attachedFileList instanceof Array) {
      this.attachedFileList.forEach( (element: any) => {
        attachFileIdList.push(String(element.uid));
      });
    }

    if (this.uploadedfileList instanceof Array) {
      this.uploadedfileList.forEach( (element: any) => {
        attachFileIdList.push(String(element.uid));
      });
    }

    this.fg.get('attachFile')?.setValue(attachFileIdList);
  }

}
