import { CommonModule } from '@angular/common';

import { Component, OnInit, inject, viewChild, output, input } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';
import { DeptHierarchy } from './dept-hierarchy.model';

import { DeptService } from './dept.service';

import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';


@Component({
  selector: 'app-checkable-dept-tree',
  imports: [
    CommonModule, NzTreeModule
  ],
  template: `
    {{defaultCheckedKeys}}
    <nz-tree
        #treeComponent
        nzCheckable
        [nzData]="nodeItems"
        [nzCheckedKeys]="defaultCheckedKeys"
        [nzSearchValue]="searchValue()"
        (nzCheckBoxChange)="nzCheck()"
        (nzClick)="nzClick($event)">
    </nz-tree>
  `,
  styles: ['']
})
export class CheckableDeptTreeComponent {

    treeComponent = viewChild.required(NzTreeComponent);

    nodeItems: DeptHierarchy[] = [];
    defaultCheckedKeys: any = [''];

    searchValue = input.required<string>();

    itemSelected = output<any>();
    itemChecked = output<any>();

    private deptService = inject(DeptService);

    public getDeptHierarchy(): void {
        this.deptService
            .getDeptHierarchyList()
            .subscribe(
                (model: ResponseList<DeptHierarchy>) => {
                    if ( model.data) {
                    this.nodeItems = model.data;
                    } else {
                    this.nodeItems = [];
                    }
                }
            );
    }

    nzClick(event: NzFormatEmitEvent): void {
        const node = event.node?.origin;
        this.itemSelected.emit(node);
    }

    nzCheck(): void {

        //this.defaultCheckedKeys = event.keys;
        //this.itemChecked.emit(event.keys);
      }

}
