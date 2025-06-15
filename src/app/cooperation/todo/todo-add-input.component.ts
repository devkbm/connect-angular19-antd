import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';

export interface TodoModel {
  pkTodoGroup: string;
  pkTodo: string;
  isCompleted: boolean;
  todo: string;
}


@Component({
  selector: 'app-todo-add-input',
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzInputModule
  ],
  template: `
    <button nz-button (click)="addTodo(newText())">add</button>
    <input nz-input placeholder="입력해주세요." [(ngModel)]="newText" (keyup.enter)="addTodo(newText())">

    <!--<button (click)="addTodo(newText)">+</button>-->
    <!--<button (click)="addTodo(newText)">+</button><input type="text" placeholder="할 일 추가" [(ngModel)]="newText" (keyup.enter)="addTodo(newText)">-->
  `,
  styles: [`
    :host {
      display: flex;
      background-color: grey;
      align-items: stretch;
    }
  `]
})
export class TodoAddInputComponent {

  pkTodoGroup = input.required<string>();
  onTodoAdded = output<TodoModel>();

  newText = model<string>('');

  constructor() {
    this.newText.set('');
  }

  addTodo(newText: string) {
    const obj: TodoModel = {pkTodoGroup: this.pkTodoGroup(), pkTodo: '', isCompleted: false, todo: newText};
    this.onTodoAdded.emit(obj);
    this.newText.set('');
  }

}
