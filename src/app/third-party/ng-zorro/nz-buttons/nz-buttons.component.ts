import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

export interface ButtonTemplate {
  text: string;
  click?(evt: MouseEvent): void;
  nzType?: string;
  isDanger?: boolean;
  popConfirm?: {
    title: string;
    confirmClick(): void;
    cancelClick?(): void;
  }
}

/**
 * example)
  btns: ButtonTemplate[] = [{
    text: 'test',
    click: (e: MouseEvent) => {
      console.log('test');
    },
    nzType: 'save'
  },{
    text: 'test2',
    click: (e: MouseEvent) => {
      console.log('test2');
    },
    nzType: 'delete',
    isDanger: true
  },{
    text: 'test3',
    click: (e: MouseEvent) => {
      console.log('test3');
    },
    isDanger: true,
    popConfirm: {
      title: 'confirm?',
      confirmClick: () => {
        console.log('confirm');
      },
      cancelClick: () => {
        console.log('cancel');
      }
    }
  }];
 */
@Component({
  selector: 'app-nz-buttons',
  imports: [CommonModule, NzButtonModule, NzIconModule, NzPopconfirmModule, NzDividerModule],
  template: `
    @for (btn of buttons(); track $index) {
      <div class="button-group">
        @if (btn.text !== '|' && btn.popConfirm === null) {
        <!-- nz-popconfirm을 사용하지 않을 경우 -->
        <button nz-button [nzDanger]="btn.isDanger" (click)="btn?.click === undefined ? true : btn?.click($event)">
          @if (btn.nzType) {
            <span nz-icon [nzType]="btn.nzType" nzTheme="outline"></span>
          }
          {{btn.text}}
        </button>
        }

        @if (btn.text !== '|' && btn.popConfirm !== null) {
        <!-- nz-popcofirm을 사용할 경우 -->
        <button nz-button [nzDanger]="btn.isDanger" (click)="btn?.click === undefined ? true : btn?.click($event)"
          nz-popconfirm [nzPopconfirmTitle]="btn.popConfirm?.title" [nzOkType]="btn.isDanger === true ? 'danger' : 'primary'"
          (nzOnConfirm)="btn.popConfirm?.confirmClick === undefined ? true : btn.popConfirm?.confirmClick()"
          (nzOnCancel)="btn.popConfirm?.cancelClick === undefined ? true : btn.popConfirm?.cancelClick()">
          @if (btn.nzType) {
            <span nz-icon [nzType]="btn.nzType" nzTheme="outline"></span>
          }
          {{btn.text}}
        </button>
        }

        @if (btn.text === '|') {
          <nz-divider nzType="vertical"></nz-divider>
        }

        <!-- isAutoDevider가 true일 경우 버튼마다 devider 생성 -->
        @if (this.isAutoDevider() && buttons.length > 0 && $index < buttons.length - 1) {
          <nz-divider nzType="vertical"></nz-divider>
        }
      </div>
    }
  `,
  styles: [`
    .button-group {
      display: inline;
    }
  `]
})
export class NzButtonsComponent {

  buttons = input.required<ButtonTemplate[]>();
  isAutoDevider = input<boolean>();
}
