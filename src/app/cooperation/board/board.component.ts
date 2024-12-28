import { AfterViewInit, Component, ViewContainerRef, inject, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { WindowRef } from 'src/app/core/window-ref';
import { BoardTreeComponent } from './board-hierarcy/board-tree.component';

import { ArticleFormComponent } from './post/post-form.component';
import { ArticleViewComponent } from './post/post-view.component';
import { ArticleGridComponent } from './post/post-grid.component';
import { ArticleListComponent } from './post/post-list.component';
import { PostList } from './post/post-list.model';

export interface TabArticle {
  tabName: string;
  articleId: string;
}

@Component({
  selector: 'app-board',
  imports: [
    FormsModule,
    ReactiveFormsModule,

    NzButtonModule,
    NzDrawerModule,
    NzTabsModule,
    NzInputModule,
    NzGridModule,
    NzTreeModule,
    NzDividerModule,
    NzIconModule,

    //ArticleGridComponent,
    BoardTreeComponent,
    ArticleViewComponent,
    ArticleFormComponent,
    //BoardFormComponent,
    //BoardManagementComponent,
    ArticleListComponent
  ],
  template: `
<div nz-row>
  <div nz-col [nzXs]="12" [nzSm]="12">

  </div>
  <div nz-col style="text-align: right" [nzXs]="12" [nzSm]="12">
    <button nz-button (click)="getBoardTree()">
      <span nz-icon nzType="search" nzTheme="outline"></span>조회
    </button>
    <button nz-button (click)="newArticle()">
      <span nz-icon nzType="form" nzTheme="outline"></span>게시글 등록
    </button>
  </div>
</div>

<div class="tree">
  <h3 class="pgm-title">게시판 목록</h3>
  <nz-input-group nzSearch [nzSuffix]="suffixIconSearch" style="margin-bottom: 8px">
    <input type="text" [(ngModel)]="queryValue" nz-input placeholder="input search text">
    <ng-template #suffixIconSearch><span nz-icon nzType="search"></span></ng-template>
  </nz-input-group>

  <app-board-tree id="boardTree" #boardTree
    [searchValue]="queryValue"
    (itemSelected)="setBoardSelect($event)">
  </app-board-tree>
</div>


<nz-tabset [(nzSelectedIndex)]="tabIndex" nzType="editable-card" nzHideAdd (nzClose)="closeTab($event)">
  <nz-tab [nzTitle]="tabTitle">
    <div id="grid-wrapper" class="grid">
      <app-post-list
        [boardId]="drawer.board.formInitId"
        (articleEditClicked)="popupEditArticle($event)"
        (articleViewClicked)="showArticle($event)">
      </app-post-list>
    </div>
  </nz-tab>
  @for (tab of tabs; track tab.articleId) {
  <nz-tab [nzClosable]="$index >= 0" [nzTitle]="tab.tabName">
    <app-post-view [id]="tab.articleId">
    </app-post-view>
  </nz-tab>
  }
</nz-tabset>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="'80%'"
    [nzVisible]="drawer.articleForm.visible"
    nzTitle="게시글 등록"
    (nzOnClose)="drawer.articleForm.visible = false">
    <app-post-form #articleForm *nzDrawerContent
      [boardId]="drawer.board.formInitId"
      [formInitId]="this.drawer.articleForm.formInitId"
      (formSaved)="getArticleGridData()"
      (formDeleted)="getArticleGridData()"
      (formClosed)="drawer.articleForm.visible = false">
    </app-post-form>
</nz-drawer>

<nz-drawer
    [nzBodyStyle]="{ height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom':'53px' }"
    [nzMaskClosable]="true"
    [nzWidth]="800"
    [nzVisible]="drawer.articleView.visible"
    nzTitle="게시글 조회"
    (nzOnClose)="drawer.articleView.visible = false">
    <app-post-view [id]="drawer.articleView.id" *nzDrawerContent>
    </app-post-view>
</nz-drawer>


  `,
  styles: `
.content {
  height: calc(100vh - 140px);
  display: grid;
  grid-template-rows: 24px 1fr;
  grid-template-columns: 200px 1fr;
}

.grid {
  height: calc(100vh - 200px);
}

.tree {
  width: 200px;
  height: calc(100vh - 140px);
  float: left;
  margin-right: 8px;
  overflow: auto;
  /*background-color:burlywood*/
}

:host ::ng-deep .ck-editor__editable {
  min-height: 700px !important;
}

.pgm-title {
  padding-left: 5px;
  border-left: 5px solid green;
}

.ime {
  -webkit-ime-mode:active;
  -moz-ime-mode:active;
  -ms-ime-mode:active;
  ime-mode:active;
}

  `
})
export class BoardComponent implements AfterViewInit {

  boardTree = viewChild.required(BoardTreeComponent);
  articleGrid = viewChild.required(ArticleGridComponent);
  articleList =  viewChild.required(ArticleListComponent);


  drawer: {
    board: { visible: boolean, formInitId: any },
    articleForm: { use: boolean, visible: boolean, formInitId: any },
    articleView: { use: boolean, visible: boolean, id: any, title: string }
  } = {
    board: { visible: false, formInitId: null },
    articleForm: { use: false, visible: false, formInitId: null },
    articleView: { use: false, visible: false, id: null, title: '' }
  }

  tabIndex: number = 0;
  tabs: TabArticle[] = [];
  tabTitle: any;

  /**
   * 게시판 트리 조회 Filter 조건
   */
  queryValue: any;

  private message = inject(NzMessageService);
  public viewContainerRef = inject(ViewContainerRef);
  private winRef = inject(WindowRef);
  private router = inject(Router);

  ngAfterViewInit(): void {
    this.getBoardTree();

    window.addEventListener('message', (event) => {
      // 팝업에서 온 메시지가 아니라면 아무 작업도 하지 않는다.
      //if (event.origin !== 'http://localhost:4200') {
      //  return;
      //}

      //console.log(this.drawer.board.initLoadId);
      //console.log(event.data);
      //console.log(event);
      // BoardId가 저장한 게시글의 boardId가 일치하면 재조회
      if (btoa(this.drawer.board.formInitId) === event.data) {
        this.getArticleGridData();
      }
    }, false);
  }

  setBoardSelect(item: any): void {
    this.tabTitle = item.title;
    this.drawer.board.formInitId = item.key;

    this.getArticleGridData();
  }

  getArticleGridData(): void {
    this.drawer.articleForm.visible = false;
    this.drawer.articleView.visible = false;

    //this.articleGrid().getArticleList(this.drawer.board.initLoadId);
    this.articleList().getArticleList(this.drawer.board.formInitId);
  }

  getBoardTree(): void {
    this.drawer.board.visible = false;
    this.boardTree().getboardHierarchy();
  }

  newArticle(): void {
    if (this.drawer.board.formInitId === null || this.drawer.board.formInitId === undefined)  {
      this.message.create('error', '게시판을 선택해주세요.');
      return;
    }

    if (this.drawer.articleForm.use) {
      this.drawer.articleForm.formInitId = null;
      this.drawer.articleForm.visible = true;
    } else {
      this.popupNewArticle();
    }

  }

  // 게시글 등록 폼 팝업으로 오픈
  popupNewArticle() {
    const boardId = btoa(this.drawer.board.formInitId);

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/article-write`, boardId])  // /grw/boarda
    );
    const popOption = 'scrollbars=yes, menubar=no, resizable=no, top=0, left=0, width=800, height=800';
    var windowObjectReference = this.winRef.nativeWindow.open(url, '_blank', popOption);
    windowObjectReference.focus();
  }

  popupEditArticle(article: PostList) {
    const boardId = btoa(this.drawer.board.formInitId);
    const articleId = btoa(article.postId);

    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/article-edit`, boardId, articleId])  // /grw/boarda
    );
    const popOption = 'scrollbars=yes, menubar=no, resizable=no, top=0, left=0, width=800, height=800';
    var windowObjectReference = this.winRef.nativeWindow.open(url, '_blank', popOption);
    windowObjectReference.focus();
  }

  selectArticle(item: any) {
    this.drawer.articleView.id = item.articleId;
    this.drawer.articleForm.formInitId = item.articleId;
  }

  editArticleByButton(item: any) {
    this.drawer.articleForm.formInitId = item.articleId;
    if (this.drawer.articleForm.formInitId === null || this.drawer.articleForm.formInitId === undefined) {
      this.message.create('error', '게시글을 선택해주세요.');
      return;
    }

    this.drawer.articleForm.visible = true;
  }

  showArticle(article: PostList) {
    this.drawer.articleView.id = article.postId;
    this.drawer.articleView.title = article.title;

    if (this.drawer.articleView.use) {
      this.addTabArticleView();
    } else {
      this.popupArticleView(article.postId);
    }
  }

  //popupArticleView(article: ArticleList) {
  popupArticleView(articleId: string) {
    const articleIdParam = btoa(articleId);
    console.log(articleId);
    console.log(articleIdParam);

    const url = this.router.serializeUrl(
      //this.router.createUrlTree([`/article-view`, {article: JSON.stringify(article)}])  // /grw/boarda
      this.router.createUrlTree([`/article-view`, {articleId: articleIdParam}])  // /grw/boarda
    );
    const popOption = 'scrollbars=yes, menubar=no, resizable=no, top=0, left=0, width=800, height=800';
    var windowObjectReference = this.winRef.nativeWindow.open(url, '_blank', popOption);
    windowObjectReference.focus();
  }

  addTabArticleView(): void {
    let title: string | null = '';
    console.log(this.drawer.articleView);
    const title_lentgh = this.drawer.articleView.title.length as number;
    if (title_lentgh > 8) {
      title = this.drawer.articleView.title.substring(0, 8) + '...';
    } else {
      title = this.drawer.articleView.title as string;
    }

    const articleId = this.drawer.articleView.id;
    const newTab: TabArticle = {
      tabName: title,
      articleId: articleId
    }

    let tabIndex = null;
    for (const index in this.tabs) {
      if (this.tabs[index].articleId === this.drawer.articleView.id) {
        tabIndex = index;
      }
    }

    if (tabIndex === null) {
      this.tabs.push(newTab);
      this.tabIndex = this.tabs.length;
    } else {
      this.tabIndex = parseInt(tabIndex,10) + 1;
    }

  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index-1, 1);
  }

  print(item: any): void {
    console.log(item);
  }

}
