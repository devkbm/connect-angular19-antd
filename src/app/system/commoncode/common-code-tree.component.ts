import { CommonModule } from '@angular/common';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeModule } from 'ng-zorro-antd/tree';

import { Component, OnInit, ViewChild, Output, EventEmitter, Input, inject, viewChild, output } from '@angular/core';
import { ResponseList } from 'src/app/core/model/response-list';
import { CommonCodeHierarchy } from './common-code-hierarchy.model';

import { CommonCodeService } from './common-code.service';


@Component({
  selector: 'app-common-code-tree',
  imports: [ CommonModule, NzTreeModule ],
  template: `
    {{searchValue}}
    <nz-tree
        #treeComponent
        [nzData]="nodeItems"
        [nzSearchValue]="searchValue"
        (nzClick)="nzClick($event)">
    </nz-tree>
  `,
  styles: ['']
})
export class CommonCodeTreeComponent implements OnInit {

  treeComponent = viewChild.required(NzTreeComponent);

  @Input() searchValue = '';

  itemSelected = output<any>();

  nodeItems: CommonCodeHierarchy[] = [];

  private service = inject(CommonCodeService);

  ngOnInit(): void {
  }

  getCommonCodeHierarchy(systemTypeCode: string) {
    const params = {
      systemTypeCode: systemTypeCode
    };

    this.service
        .getCodeHierarchy(params)
        .subscribe(
          (model: ResponseList<CommonCodeHierarchy>) => {
            model.data ? this.nodeItems = model.data : this.nodeItems = [];
          }
        );
  }

  nzClick(event: NzFormatEmitEvent) {
    const node = event.node?.origin;
    this.itemSelected.emit(node);
  }

}
