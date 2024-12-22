import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, Renderer2, effect, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { BoardManagementService } from './board-management.service';

import { ResponseObject } from 'src/app/core/model/response-object';
import { BoardManagement } from './board-management.model';
import { BoardHierarchy } from '../board-hierarcy/board-hierarchy.model';
import { ResponseList } from 'src/app/core/model/response-list';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { NzInputTreeSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-tree-select/nz-input-tree-select.component';
import { NzFormItemCustomComponent } from "src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component";
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';


@Component({
  selector: 'app-board-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzInputTreeSelectComponent,
    NzFormItemCustomComponent,
    NzInputSelectComponent
],
  template: `
    <div>{{fg.getRawValue() | json}}</div>

    <!--
    <button nz-button (click)="get(this.fg.value.boardId!)">
      <span nz-icon nzType="search"></span>조회
    </button>
    <nz-divider nzType="vertical"></nz-divider>
-->
    <button nz-button (click)="newForm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>신규
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzType="primary" (click)="save()">
      <span nz-icon nzType="save" nzTheme="outline"></span>저장
    </button>
    <nz-divider nzType="vertical"></nz-divider>
    <!--
    <button nz-button (click)="closeForm()">
      <span nz-icon nzType="form" nzTheme="outline"></span>닫기
    </button>
-->
    <nz-divider nzType="vertical"></nz-divider>
    <button nz-button nzDanger (click)="remove()">
      <span nz-icon nzType="delete" nzTheme="outline"></span>삭제
    </button>

    <!-- ERROR TEMPLATE-->
    <ng-template #errorTpl let-control>
      @if (control.hasError('required')) {
        필수 입력 값입니다.
      }
    </ng-template>

    <form nz-form [formGroup]="fg" nzLayout="vertical" #form>
      <!-- 1 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="12">
          <nz-form-item-custom for="boardParentId" label="상위 게시판">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-tree-select
                formControlName="boardParentId" itemId="boardParentId"
                [nodes]="parentBoardItems"
                placeholder="상위 게시판 없음"
              >
              </nz-input-tree-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="12">
          <nz-form-item-custom for="boardType" label="게시판타입" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-input-select required
                formControlName="boardType" itemId="boardType"
                [options]="boardTypeList" [opt_value]="'value'" [opt_label]="'label'"
                placeholder="게시판타입을 선택해주세요."
              >
              </nz-input-select>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>

      <!-- 2 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="boardName" label="게시판 명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="boardName" formControlName="boardName" required
                placeholder="게시판명을 입력해주세요."
              />
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

      <!-- 3 row -->
      <div nz-row nzGutter="8">
        <div nz-col nzSpan="24">
          <nz-form-item-custom for="boardDescription" label="게시판 설명">
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <textarea nz-input id="boardDescription" formControlName="boardDescription"
                placeholder="게시판 설명을 입력해주세요." [rows]="20"
              >
              </textarea>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>

    </form>

    <!--
    <div class="footer">
      <app-nz-crud-button-group
        [isSavePopupConfirm]="false"
        (searchClick)="get(this.fg.value.boardId!)"
        (closeClick)="closeForm()"
        (saveClick)="save()"
        (deleteClick)="remove()">
      </app-nz-crud-button-group>
    </div>
    -->
  `,
  styles: [`
    [nz-button] {
        margin-right: 8px;
    }

    .btn-group {
      padding: 6px;
      /*background: #fbfbfb;*/
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    }

    .footer {
      position: absolute;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid rgb(232, 232, 232);
      padding: 10px 16px;
      text-align: right;
      left: 0px;
      /*background: #fff;*/
    }

  `]
})
export class BoardFormComponent implements OnInit, AfterViewInit {

  parentBoardItems: BoardHierarchy[] = [];

  boardTypeList: any;

  private service = inject(BoardManagementService);
  private renderer = inject(Renderer2);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    boardId         : new FormControl<string | null>(null),
    boardParentId   : new FormControl<string | null>(null),
    boardName       : new FormControl<string | null>('', { validators: [Validators.required] }),
    boardType       : new FormControl<string | null>('', { validators: [Validators.required] }),
    boardDescription: new FormControl<string | null>(null)
  });

  formInitId = input<any>();

  constructor() {
    effect(() => {
      if (this.formInitId()) {
        this.get(this.formInitId());
      }
    })
  }

  ngOnInit() {
    this.getboardHierarchy();
    this.getBoardTypeList();
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput() {
    this.renderer.selectRootElement('#boardName').focus();
  }

  newForm(): void {
    this.fg.reset();
    this.fg.controls.boardId.enable();
    this.fg.controls.boardType.setValue('BOARD');

    this.focusInput();
  }

  modifyForm(formData: BoardManagement): void {
    this.fg.controls.boardId.disable();

    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string): void {
    this.service.getBoard(id)
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            if (model.data) {
              this.modifyForm(model.data);
            } else {
              this.newForm();
            }
          }
        );
  }

  save(): void {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      return;
    }

    this.service
        .saveBoard(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            this.formSaved.emit(this.fg.getRawValue());
          }
        );
  }

  remove(): void {
    this.service
        .deleteBoard(this.fg.getRawValue())
        .subscribe(
          (model: ResponseObject<BoardManagement>) => {
            console.log(model);
            this.formDeleted.emit(this.fg.getRawValue());
          }
        );
  }

  getboardHierarchy(): void {
    this.service
        .getBoardHierarchy()
        .subscribe(
          (model: ResponseList<BoardHierarchy>) => {
            this.parentBoardItems = model.data;
            //this.appAlarmService.changeMessage(model.message);
            // title 노드 텍스트
            // key   데이터 키
            // isLeaf 마지막 노드 여부
            // checked 체크 여부
          }
        );
  }

  getBoardTypeList(): void {
    this.service
        .getBoardTypeList()
        .subscribe(
          (model: ResponseObject<any>) => {
            this.boardTypeList = model.data;
          }
        );
  }

}