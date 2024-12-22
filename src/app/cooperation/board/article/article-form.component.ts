import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, inject, input, output, viewChild } from '@angular/core';

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
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { ArticleFileUploadComponent } from './article-file-upload.component';


@Component({
  selector: 'app-article-form',
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
    ArticleFileUploadComponent
  ],
  template: `
    <!--{{fg.getRawValue() | json}}-->
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

      <app-article-file-upload
        [(uploadedFileList)]="fileList"
        (uploadCompleted)="save()">
      </app-article-file-upload>

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
export class ArticleFormComponent implements OnInit, AfterViewInit {
  //public Editor = ClassicEditor;

  editorConfig = {
    //plugins: [ Font ],
    toolbar: [ 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor','heading', '|', 'bold', 'italic' ]
  };

  fileList: any = [
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
  article!: Article;

  @Input() boardId!: string;

  formElement = viewChild.required<ElementRef>('form');

  upload = viewChild.required<NzUploadComponent>('upload');
  ckEditor = viewChild.required<CKEditorComponent>('ckEditor');

  uploader = viewChild.required(ArticleFileUploadComponent);

  private boardService= inject(ArticleService);
  private activatedRoute = inject(ActivatedRoute);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    boardId         : new FormControl<string | null>(null, { validators: [Validators.required] }),
    articleId       : new FormControl<string | null>(null, { validators: [Validators.required] }),
    articleParentId : new FormControl<string | null>(null),
    title           : new FormControl<string | null>(null, { validators: [Validators.required] }),
    contents        : new FormControl<string | null>(null),
    attachFile      : new FormControl<any>(null)
    /*
    pwd             : string;
    hitCnt          : string;
    fromDate        : string;
    toDate          : string;
    seq             : number;
    depth           : number;
    articleChecks   : ArticleRead[];
    fileList        : string[];
    file            : File;
    editable        : boolean
    */
  });

  initLoadId = input<string>('');

  ngOnInit(): void {

    if (this.activatedRoute.snapshot.params['boardId']) {
      this.boardId = this.activatedRoute.snapshot.params['boardId'];
    }

    if (this.activatedRoute.snapshot.params['initLoadId']) {
      this.initLoadId = this.activatedRoute.snapshot.params['initLoadId'];
    }

    if (this.initLoadId()) {
      this.get(this.initLoadId());
    } else {
      this.newForm(this.boardId);
    }

    this.fileUploadUrl = GlobalProperty.serverUrl + '/common/file/';
    this.fileUploadHeader = {
      Authorization: sessionStorage.getItem('token')
      /*'Content-Type': 'multipart/form-data'*/
    };
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
    this.fileList = [];
    this.textData = null;
    // console.log(this.ckEditor.editorInstance);
    //this.ckEditor.writeValue(null);

    this.focusInput();
  }

  modifyForm(formData: Article): void {
    this.fg.reset();
    this.fg.patchValue(formData);
  }

  closeForm(): void {
    this.formClosed.emit(this.fg.getRawValue());

    // 팝업 호출한 경우 팝업 종료
    if (window.opener) {
      window.close();
    }

  }

  get(id: any): void {
    this.boardService.getArticle(id)
        .subscribe(
          (model: ResponseObject<Article>) => {
            if (model.data) {
              this.article = model.data;

              this.modifyForm(model.data);
              this.fileList = model.data.fileList;

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
          (model: ResponseObject<Article>) => {
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
    this.boardService.deleteArticle(id)
      .subscribe(
        (model: ResponseObject<Article>) => {
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
      this.fileList.push(param.file.response[0]);
    }
  }

  textChange({ editor }: ChangeEvent): void {

    //const data = editor.getData();
    //this.fg.get('contents')?.setValue(data);
  }

  convertFileList() {
    const attachFileIdList: any = [];

    if (this.fileList instanceof Array) {
      this.fileList.forEach( (element: any) => {
        attachFileIdList.push(String(element.uid));
      });
    }

    this.fg.get('attachFile')?.setValue(attachFileIdList);
  }

}
