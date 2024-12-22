import { CommonModule } from '@angular/common';
import { Component, inject, viewChild, output, input } from '@angular/core';

import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';

import { ResponseList } from 'src/app/core/model/response-list';
import { BoardHierarchy } from './board-hierarchy.model';
import { BoardHierarcyService } from './board-hierarcy.service';


@Component({
  selector: 'app-board-tree',
  imports: [
    CommonModule, NzTreeModule
  ],
  template: `
    <!--{{items | json}}-->
    <!--{{ searchValue() }}-->
    <nz-tree
      #treeCom
      nzShowLine
      [nzData]="items"
      [nzSelectedKeys]="selectedKeys"
      [nzSearchValue]="searchValue()"
      (nzSearchValueChange)="searchValueChange($event)"
      (nzClick)="nzClick($event)"
      (nzDblClick)="nzDbClick($event)">
  </nz-tree>
  `,
  styles: `
  `
})
export class BoardTreeComponent {

  treeCom = viewChild.required(NzTreeComponent);

  protected items: BoardHierarchy[] = [];
  selectedKeys: string[] = [];

  searchValue = input.required<string>();

  itemSelected = output<any>();
  itemDbClicked = output<any>();

  #service = inject(BoardHierarcyService);

  getboardHierarchy(): void {
    this.#service
        .getBoardHierarchy()
        .subscribe(
          (model: ResponseList<BoardHierarchy>) => {
              if ( model.data ) {
                this.items = model.data;
                this.selectedKeys = [this.items[0].key];
                this.itemSelected.emit(this.items[0]);
              } else {
                this.items = [];
              }

              // title 노드 텍스트
              // key   데이터 키
              // isLeaf 마지막 노드 여부
              // checked 체크 여부
          }
        );
  }

  nzClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

  public nzDbClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemDbClicked.emit(node);
  }

  searchValueChange(event: NzFormatEmitEvent): void {
    const keys = event.keys;

    console.log(keys);
  }

}
