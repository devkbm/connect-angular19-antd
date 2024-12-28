import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostService } from './post.service';
import { NzListModule } from 'ng-zorro-antd/list';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ArticleListRowComponent } from './post-list-row.component';
import { PostList } from './post-list.model';
import { ResponseSpringslice } from 'src/app/core/model/response-springslice';

// 무한 스크롤 적용 필요
// https://www.npmjs.com/package/ngx-infinite-scroll

@Component({
  selector: 'app-post-list',
  imports: [
    CommonModule,
    NzListModule,
    NzButtonModule,
    InfiniteScrollDirective,
    ArticleListRowComponent
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
      @for (article of articles; track article.postId; let idx = $index) {
        <app-post-list-row
          [article]="article"
          (viewClicked)="onViewClicked(article)"
          (editClicked)="onEditClicked(article)">
        </app-post-list-row>

        @if (idx < articles.length - 1) {
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
export class ArticleListComponent {

  private service = inject(PostService);
  articles: PostList[] = [];

  boardId = input<string>();
  height = input<string>('100%');

  articleEditClicked = output<PostList>();
  articleViewClicked = output<PostList>();

  pageable: {page: number, isLast: boolean} = {page: 0, isLast: false};

  constructor() {
    effect(() => {
      if (this.boardId()) {
        this.getArticleList(this.boardId());
      }
    })

  }

  getArticleList(boardId: any, page: number = 0): void {
    this.service
        .getArticleSlice(boardId, undefined, undefined, page)
        .subscribe(
          (model: ResponseSpringslice<PostList>) => {
            if (model.numberOfElements > 0) {
              if (model.first) this.articles = [];

              this.articles.push(...model.content);
              this.pageable ={page: model.number, isLast: model.last};
            } else {
              this.articles = [];
            }
            //this.appAlarmService.changeMessage(model.message);
          }
        );
  }

  onEditClicked(article: any) {
    this.articleEditClicked.emit(article);
  }

  onViewClicked(article: any) {
    this.articleViewClicked.emit(article);
  }

  onScroll(ev: any) {
    //console.log("scrolled!");
    //console.log(ev);

    if (!this.pageable.isLast) {
      this.getArticleList(this.boardId(), this.pageable.page + 1);
    }
  }

  onScrollUp(ev: any) {
    //console.log("scrolled Up!");
    //console.log(ev);
  }
}
