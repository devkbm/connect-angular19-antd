import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseList } from 'src/app/core/model/response-list';
import { DataService } from 'src/app/core/service/data.service';
import { BoardHierarchy } from '../board-hierarcy/board-hierarchy.model';
import { ResponseObject } from 'src/app/core/model/response-object';
import { BoardManagement } from './board-management.model';

@Injectable({
  providedIn: 'root'
})
export class BoardManagementService extends DataService {

  constructor() {
    super('/api/grw');
  }

  getBoardTypeList(): Observable<ResponseList<any>> {
    const url = `${this.API_URL}/board/boardType`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseList<any>>(url, options)
      .pipe(
      //catchError((err) => Observable.throw(err))
      );
  }

  getBoardHierarchy(): Observable<ResponseList<BoardHierarchy>> {
    const url = `${this.API_URL}/boardHierarchy`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .get<ResponseList<BoardHierarchy>>(url, options)
      .pipe(
        //catchError((err) => Observable.throw(err))
      );
  }

  getBoard(id: string): Observable<ResponseObject<BoardManagement>> {
    const url = `${this.API_URL}/board/${id}`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true
      };

    return this.http
      .get<ResponseObject<BoardManagement>>(url, options)
      .pipe(
          //catchError((err) => Observable.throw(err))
      );
  }

  saveBoard(board: BoardManagement): Observable<ResponseObject<BoardManagement>> {
    const url = `${this.API_URL}/board`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
    .post<ResponseObject<BoardManagement>>(url, board, options)
    .pipe(
//      catchError((err) => Observable.throw(err))
    );

  }

  deleteBoard(board: BoardManagement): Observable<ResponseObject<BoardManagement>> {
    const url = `${this.API_URL}/board/${board.boardId}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http
      .delete<ResponseObject<BoardManagement>>(url, options)
      .pipe(
  //      catchError((err) => Observable.throw(err))
      );
  }
}
