import { Injectable } from '@angular/core';

import { DataService} from 'src/app/core/service/data.service';
import { ResponseObject } from 'src/app/core/model/response-object';
import { ResponseList } from 'src/app/core/model/response-list';

import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { TodoGroupModel } from './todo-group.model';
import { TodoModel } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService extends DataService {

  constructor() {
    super('/api/todo');
  }

  getMyTodoGroupList(params?: any): Observable<ResponseList<TodoGroupModel>> {
    const url = `${this.API_URL}/group/mylist`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true,
        params: params
     };

    return this.http.get<ResponseList<TodoGroupModel>>(url, options).pipe(
      catchError(this.handleError<ResponseList<TodoGroupModel>>('getMyTodogroupList', undefined))
    );
  }

  newTodoGroup(): Observable<ResponseObject<TodoGroupModel>> {
    const url = `${this.API_URL}/group/new`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<TodoGroupModel>>(url, null, options).pipe(
      catchError(this.handleError<ResponseObject<TodoGroupModel>>('newTodoGroup', undefined))
    );
  }

  saveTodoGroup(obj: TodoGroupModel): Observable<ResponseObject<TodoGroupModel>> {
    const url = `${this.API_URL}/group`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<TodoGroupModel>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<TodoGroupModel>>('saveTodoGroup', undefined))
    );
  }

  deleteTodoGroup(id: string): Observable<ResponseObject<TodoGroupModel>> {
    const url = `${this.API_URL}/group/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.delete<ResponseObject<TodoGroupModel>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<TodoGroupModel>>('saveTodoGroup', undefined))
    );
  }

  getTodoList(groupId: string): Observable<ResponseList<TodoModel>> {
    const url = `${this.API_URL}/group/${groupId}/list`;
    const options = {
        headers: this.getAuthorizedHttpHeaders(),
        withCredentials: true
     };

    return this.http.get<ResponseList<TodoModel>>(url, options).pipe(
      catchError(this.handleError<ResponseList<TodoModel>>('getTodoList', undefined))
    );
  }

  saveTodo(obj: TodoModel): Observable<ResponseObject<TodoModel>> {
    const url = `${this.API_URL}/group/todo`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };
    return this.http.post<ResponseObject<TodoModel>>(url, obj, options).pipe(
      catchError(this.handleError<ResponseObject<TodoModel>>('saveTodo', undefined))
    );
  }

  deleteTodo(groupId: string, id: string): Observable<ResponseObject<TodoModel>> {
    const url = `${this.API_URL}/group/${groupId}/todo/${id}`;
    const options = {
      headers: this.getAuthorizedHttpHeaders(),
      withCredentials: true
    };

    return this.http.delete<ResponseObject<TodoModel>>(url, options).pipe(
      catchError(this.handleError<ResponseObject<TodoModel>>('saveTodoGroup', undefined))
    );
  }

}
