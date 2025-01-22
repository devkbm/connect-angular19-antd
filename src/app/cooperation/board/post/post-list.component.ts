import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostService } from './post.service';
import { NzListModule } from 'ng-zorro-antd/list';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PostListRowComponent } from './post-list-row.component';
import { PostList } from './post-list.model';
import { ResponseSpringslice } from 'src/app/core/model/response-springslice';
import { HttpClient } from '@angular/common/http';
import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getAuthorizedHttpHeaders } from 'src/app/core/http/http-utils';

// 무한 스크롤 적용 필요
// https://www.npmjs.com/package/ngx-infinite-scroll

@Component({
  selector: 'app-post-list',
  imports: [
    CommonModule,
    NzListModule,
    NzButtonModule,
    InfiniteScrollDirective,
    PostListRowComponent
  ],
  template: `
    <div
      class="container" [style.height]="this.height()"
      infiniteScroll
      [infiniteScrollDistance]="2"
      [infiniteScrollThrottle]="275"
      [infiniteScrollUpDistance]="1"
      [alwaysCallback]="true"
      [scrollWindow]="false"
      (scrolled)="onScroll($event)"
      (scrolledUp)="onScrollUp($event)">
      <!--
      <nz-list>
        @for (article of articles; track article.articleId; let idx = $index) {
          <nz-list-item>
            <nz-list-item-meta
              nzAvatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              [nzDescription]="article.title">
              <nz-list-item-meta-title>
                <a (click)="onViewClicked(article)"><div [innerHTML]="article.contents"></div></a>
                <button nz-button (click)="onEditClicked(article)"><span nz-icon nzType="search" nzTheme="outline"></span>edit</button>
              </nz-list-item-meta-title>
            </nz-list-item-meta>
          </nz-list-item>
        }
      </nz-list>
      -->

      <!--{{this.pageable | json}}-->
      @for (post of posts; track post.postId; let idx = $index) {
        <app-post-list-row
          [post]="post"
          (viewClicked)="onViewClicked(post)"
          (editClicked)="onEditClicked(post)">
        </app-post-list-row>

        @if (idx < posts.length - 1) {
          <hr class="hr-line">
        }
      }
    </div>
  `,
  styles: `
    .container {
      overflow: auto;
    }

    .hr-line {
      border-width:1px 0 0 0; border-color:#818181;
    }
  `
})
export class PostListComponent {

  private http = inject(HttpClient);
  private service = inject(PostService);

  posts: PostList[] = [];

  boardId = input<string>();
  height = input<string>('100%');

  editClicked = output<PostList>();
  viewClicked = output<PostList>();

  pageable: {page: number, isLast: boolean} = {page: 0, isLast: false};

  constructor() {
    effect(() => {
      if (this.boardId()) {
        this.getList(this.boardId());
      }
    })
  }

  getList(boardId: any, page: number = 0, size: number = 10): void {
    /*
    this.service
        .getSlice(boardId, undefined, undefined, page)
        .subscribe(
          (model: ResponseSpringslice<PostList>) => {
            if (model.numberOfElements > 0) {
              if (model.first) this.posts = [];

              this.posts.push(...model.content);
              this.pageable ={page: model.number, isLast: model.last};
            } else {
              this.posts = [];
            }
            //this.appAlarmService.changeMessage(model.message);
          }
        );
    */
    let url = GlobalProperty.serverUrl + `/api/grw/board/post_slice?boardId=${boardId}`;
    const options = {
      headers: getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    url = url + '&page='+ page + '&size='+ size;

    this.http.get<ResponseSpringslice<PostList>>(url, options).pipe(
        //  catchError((err) => Observable.throw(err))
      ).subscribe(
        (model: ResponseSpringslice<PostList>) => {
          if (model.numberOfElements > 0) {
            if (model.first) this.posts = [];

            this.posts.push(...model.content);
            this.pageable ={page: model.number, isLast: model.last};
          } else {
            this.posts = [];
          }
          //this.appAlarmService.changeMessage(model.message);
        }
      );
  }

  onEditClicked(post: any) {
    this.editClicked.emit(post);
  }

  onViewClicked(post: any) {
    this.viewClicked.emit(post);
  }

  onScroll(ev: any) {
    //console.log("scrolled!");
    //console.log(ev);

    if (!this.pageable.isLast) {
      this.getList(this.boardId(), this.pageable.page + 1);
    }
  }

  onScrollUp(ev: any) {
    //console.log("scrolled Up!");
    //console.log(ev);
  }
}
