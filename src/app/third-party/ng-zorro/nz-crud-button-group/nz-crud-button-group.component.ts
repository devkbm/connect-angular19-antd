import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-nz-crud-button-group',
  imports: [CommonModule, NzButtonModule, NzDividerModule, NzIconModule, NzPopconfirmModule],
  template:`
    <nz-button-group>
      @if (searchVisible()) {
        <button nz-button (click)="searchButtonClick($event)">
          <span nz-icon nzType="search"></span>
          조회
        </button>
        <nz-divider nzType="vertical"></nz-divider>
      }

      @if (saveVisible()) {
        @if (isSavePopupConfirm()) {
          <!--저장 재확인할 경우 -->
          <button nz-button nzType="primary"
                  nz-popconfirm nzPopconfirmTitle="저장하시겠습니까?"
                  (nzOnConfirm)="saveButtonClick()" (nzOnCancel)="false">
            <span nz-icon nzType="save" nzTheme="outline"></span>저장
          </button>
        } @else {
          <!--저장 재확인하지 않을 경우 -->
          <button nz-button nzType="primary"
            (click)="saveButtonClick()">
            <span nz-icon nzType="save" nzTheme="outline"></span>저장
          </button>
        }
        <nz-divider nzType="vertical"></nz-divider>
      }

      @if (deleteVisible()) {
        @if (isDeletePopupConfirm()) {
        <!--삭제 재확인할 경우 -->
        <button  nz-button nzDanger
          nz-popconfirm nzPopconfirmTitle="삭제하시겠습니까?"
          (nzOnConfirm)="deleteButtonClick()" (nzOnCancel)="false">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
        } @else {
        <!--삭제 재확인하지 않을 경우 -->
        <button nz-button nzDanger (click)="deleteButtonClick()">
          <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
        </button>
        }
        <nz-divider nzType="vertical"></nz-divider>
      }

      <button nz-button (click)="closeButtonClick($event)">
        <span nz-icon nzType="form" nzTheme="outline"></span>
        닫기
      </button>
    </nz-button-group>
  `,
  styles: `
    .select_button {
      background-color: green;
    }
  `
})
export class NzCrudButtonGroupComponent implements OnInit {

  isSavePopupConfirm = input<boolean>(true);
  isDeletePopupConfirm = input<boolean>(true);

  searchVisible = input<boolean>(true);
  saveVisible = input<boolean>(true);
  deleteVisible = input<boolean>(true);

  searchClick = output<any>();
  saveClick = output<any>();
  deleteClick = output<any>();
  closeClick = output<any>();

  ngOnInit(): void {
  }

  searchButtonClick(event: any) {
    this.searchClick.emit(event);
  }

  // @HostListener('window:keydown.control.f1', ['$event'])
  @HostListener('window:keydown.alt.s', ['$event'])
  saveHotKeyClick(event: KeyboardEvent) {
    event.preventDefault();
    this.saveClick.emit(event);
  }

  saveButtonClick() {
    this.saveClick.emit('');
  }

  @HostListener('window:keydown.alt.r', ['$event'])
  deleteButtonClick() {
    this.deleteClick.emit('');
  }

  @HostListener('window:keydown.alt.q', ['$event'])
  closeButtonClick(event: any) {
    this.closeClick.emit(event);
  }

}
