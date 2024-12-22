import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '../../../core/service/data.service';
import { ResponseObject } from '../../../core/model/response-object';
import { ResponseList } from '../../../core/model/response-list';

import { Board } from './board.model';
import { Article } from './article.model';
import { GlobalProperty } from 'src/app/core/global-property';
import { ResponseSpringslice } from 'src/app/core/model/response-springslice';
import { ArticleList } from './article-list.model';


@Injectable({
  providedIn: 'root'
})
export class ArticleService extends DataService {

  constructor() {
      super('/api/grw');
  }

  getBoardList(): Observable<ResponseList<Board>> {
    const url = `${this.API_URL}/board`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true
      };

    return this.http
      .get<ResponseList<Board>>(url, options)
      .pipe(
          //catchError((err) => Observable.throw(err))
      );
  }


  getArticleList(boardId: string, title?: string, contents?: string): Observable<ResponseList<Article>> {
    let url = `${this.API_URL}/board/article?boardId=${boardId}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    if ( title !== undefined ) {
        url = url + '&title=' + title;
    }

    if ( contents !== undefined ) {
        url = url + '&contents=' + contents;
    }

    return this.http
      .get<ResponseList<Article>>(url, options)
      .pipe(
        //  catchError((err) => Observable.throw(err))
      );
  }

  getArticleSlice(boardId: string, title?: string, contents?: string, page: number = 0, size: number = 10): Observable<ResponseSpringslice<ArticleList>> {
    let url = `${this.API_URL}/board/article_slice?boardId=${boardId}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    if ( title !== undefined ) {
        url = url + '&title=' + title;
    }

    if ( contents !== undefined ) {
        url = url + '&contents=' + contents;
    }

    url = url + '&page='+ page + '&size='+ size;

    return this.http
      .get<ResponseSpringslice<ArticleList>>(url, options)
      .pipe(
        //  catchError((err) => Observable.throw(err))
      );
  }


  getArticle(id: number): Observable<ResponseObject<Article>> {
    const url = `${this.API_URL}/board/article/${id}`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true
      };

    return this.http
      .get<ResponseObject<Article>>(url, options)
      .pipe(
         // catchError((err) => Observable.throw(err))
      );
  }

  saveArticle(article: Article): Observable<ResponseObject<Article>> {
    const url = `${this.API_URL}/board/article`;
    const options = {
        headers: this.getAuthorizedMultiPartHeaders(),
        withCredentials: true
      };

    let formData = new FormData();

    formData.append('articleId',    String(article.articleId));
    formData.append('boardId',      String(article.boardId));
    // formData.append('ppkArticle',   article.ppkArticle.toString());
    formData.append('title',        article.title);
    formData.append('contents',     article.contents);
    formData.append('pwd',          article.pwd);
    formData.append('hitCnt',       article.hitCnt);
    formData.append('fromdDt',      article.fromDate);
    formData.append('toDt',         article.toDate);
    // formData.append('seq',          String(article.seq));
    // formData.append('depth',        String(article.depth));
    if ( article.file !== undefined ) {
        formData.append('file',         article.file, article.file.name);
    }

    return this.http
      .post<ResponseObject<Article>>(url, formData, options)
      .pipe(
        //  catchError((err) => Observable.throw(err))
      );
  }

  saveArticleJson(article: any): Observable<ResponseObject<Article>> {
    const url = `${this.API_URL}/board/article`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .post<ResponseObject<Article>>(url, article, options)
      .pipe(
          //catchError((err) => Observable.throw(err))
      );
  }

  deleteArticle(id: any): Observable<ResponseObject<Article>> {
    const url = `${this.API_URL}/board/article/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<Article>>(url, options)
      .pipe(
        //catchError((err) => Observable.throw(err))
      );
  }

  downloadFile(fileId: string, fileName: string) {
    const url = GlobalProperty.serverUrl + `/file/${fileId}`;
    const options = {
      headers: this.getAuthorizedMultiPartHeaders(),
      responseType: 'blob',
      withCredentials: true
    };

    this.http.get(url, {headers: this.getAuthorizedMultiPartHeaders(), responseType: 'blob'})
    .subscribe(
        (model: Blob) => {
            // const blob = new Blob([model], { type: 'application/octet-stream' });
            // FileSaver.saveAs(blob, fileName);
          }
        );
  }

  updateHitCount(id: number, userId: string): Observable<ResponseObject<void>> {
    const url = `${this.API_URL}/board/article/hitcnt`;
    const param = {id: id, userId: userId};

    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true,
      params: param
    };

    return this.http
      .get<ResponseObject<void>>(url, options)
      .pipe(
        //catchError((err) => Observable.throw(err))
      );
  }

}
