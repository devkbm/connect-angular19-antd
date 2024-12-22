import { NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';

import { Component, inject, viewChild, output, input } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';
import { DeptHierarchy } from './dept-hierarchy.model';

import { DeptService } from './dept.service';

import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';


@Component({
  selector: 'app-dept-tree',
  imports: [ NzTreeModule ],
  template: `
    <!--
    <button (click)="getCommonCodeHierarchy()">
        조회
    </button>
    -->
    {{searchValue()}}
    <nz-tree
        #treeComponent
        [nzData]="nodeItems"
        [nzSearchValue]="searchValue()"
        (nzClick)="nzClick($event)">
    </nz-tree>
  `,
  styles: ['']
})
export class DeptTreeComponent {

  treeComponent = viewChild.required(NzTreeComponent);

  nodeItems: DeptHierarchy[] = [];

  searchValue = input.required<string>();

  itemSelected = output<any>();

  private deptService = inject(DeptService);

  public getDeptHierarchy(): void {
    this.deptService
        .getDeptHierarchyList()
        .subscribe(
            (model: ResponseList<DeptHierarchy>) => {
              model.data ? this.nodeItems = model.data : this.nodeItems = [];
            }
        );
  }

  nzClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

}
