import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ResponseList } from 'src/app/core/model/response-list';
import { ResponseObject } from 'src/app/core/model/response-object';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { TodoTextComponent } from './todo-text.component';
import { TodoAddInputComponent } from './todo-add-input.component';
import { TodoGroupListComponent } from './todo-group-list.component';

export interface TodoGroupModel {
  pkTodoGroup: string;
  todoGroupName: string;
  isSelected: boolean;
}

export interface TodoModel {
  pkTodoGroup: string;
  pkTodo: string;
  isCompleted: boolean;
  todo: string;
}

@Component({
  selector: 'todo-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TodoGroupListComponent,
    TodoAddInputComponent,
    TodoTextComponent
  ],
  template: `
<div class="title">
  <h1>나의 하루</h1>
  <h2>{{ today | date:'M월 d일' }}</h2>
</div>

<div class="todo-body">
  <div class="todo-group">
    <app-todo-group-list
      (onSelectedTodoGroup)="getTodoList($event)"
      (onDeletedTodoGroup)="deleteTodoGroup($event)">
    </app-todo-group-list>
  </div>

  <div class="todo">
    <app-todo-add-input
      [pkTodoGroup]="selectedPkTodoGroup"
      (onTodoAdded)="addTodo($event)">
    </app-todo-add-input>

    @for (todo of todos; track todo.pkTodo) {
      <app-todo-text [todo]="todo" (stateChanged)="toggleTodo($event)" (deleteClicked)="deleteTodo($event)"></app-todo-text>
    }
  </div>

</div>
  `,
  styles: `
.title {
  background-color: blueviolet;
  padding:  46px 26px 26px 16px;
  color: white;
  font-weight: normal;
}

.todo-body {
  display: grid;
  height: calc(100% - 158px);
  padding-top: 10px;

  /*grid-template-rows: 220px 1fr;*/
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "todo-group todo";
    /*"title calendar";*/
}

.todo-group {
  grid-area: todo-group;
  overflow: auto;
  background-color: orange;
}

.todo {
  grid-area: todo;
  overflow: auto;
}

h1, h2 {
  margin: 0;
  font-weight: normal;
}

h2 {
  margin-bottom: 16px;
}

app-todo, app-add-todo {
  border-bottom: 1px solid #cccccc;
}
  `
})
export class TodoApp implements OnInit {

  todos: TodoModel[];
  today: Date = new Date();

  selectedPkTodoGroup: string = '';
  newText: string = '';

  private http = inject(HttpClient);

  constructor() {
    this.todos = [

      // {isCompleted: false, todo: '할일1'},
      // {isCompleted: false, todo: '할일2'}
    ];
  }

  ngOnInit() {

  }

  toggleTodo(todo: TodoModel) {
    const url = GlobalProperty.serverUrl + `/api/todo/group/todo`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<TodoModel>>(url, todo, options).pipe(
          //catchError(this.handleError<ResponseObject<TodoModel>>('saveTodo', undefined))
        )
        .subscribe(
          (model: ResponseObject<TodoModel>) => {
            console.log(model);
          }
        )
  }

  addTodo(todo: TodoModel) {
    const url = GlobalProperty.serverUrl + `/api/todo/group/todo`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<TodoModel>>(url, todo, options).pipe(
          //catchError(this.handleError<ResponseObject<TodoModel>>('saveTodo', undefined))
        )
        .subscribe(
          (model: ResponseObject<TodoModel>) => {
            console.log(model);
            this.todos.push({
              pkTodoGroup : model.data.pkTodoGroup,
              pkTodo : model.data.pkTodo,
              isCompleted : model.data.isCompleted,
              todo : model.data.todo
            });
          }
        )
  }

  deleteTodo(todo: TodoModel) {
    const url = GlobalProperty.serverUrl + `/api/todo/group/${todo.pkTodoGroup}/todo/${todo.pkTodo}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<TodoModel>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<TodoModel>>('saveTodoGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<TodoModel>) => {
            let index = this.todos.findIndex((e) => e.pkTodoGroup === todo.pkTodoGroup && e.pkTodo === todo.pkTodo);
            console.log(index);
            this.todos.splice(index, 1);
          }
        );

        /*
    this.service
        .deleteTodo(todo.pkTodoGroup, todo.pkTodo)
        .subscribe(
          (model: ResponseObject<TodoModel>) => {
            let index = this.todos.findIndex((e) => e.pkTodoGroup === todo.pkTodoGroup && e.pkTodo === todo.pkTodo);
            console.log(index);
            this.todos.splice(index, 1);
          }
        );
        */
  }

  getTodoList(pkTodoGroup: string): void {
    this.selectedPkTodoGroup = pkTodoGroup;

    const url = GlobalProperty.serverUrl + `/api/todo/group/${pkTodoGroup}/list`;
    const options = getHttpOptions();

    this.http.get<ResponseList<TodoModel>>(url, options).pipe(
         // catchError(this.handleError<ResponseList<TodoModel>>('getTodoList', undefined))
        )
        .subscribe(
          (model: ResponseList<TodoModel>) => {
            console.log(model);
            this.todos = model.data;
          }
        );
  }

  deleteTodoGroup(pkTodoGroup: string) {
    const url = GlobalProperty.serverUrl + `/api/todo/group${pkTodoGroup}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<TodoGroupModel>>(url, options).pipe(
          //catchError(this.handleError<ResponseObject<TodoGroupModel>>('saveTodoGroup', undefined))
        )
        .subscribe(
          (model: ResponseObject<TodoGroupModel>) => {
          }
        );
  }
}

