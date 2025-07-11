import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponseObject } from 'src/app/core/model/response-object';
import { ShapeComponent } from "src/app/core/app/shape.component";
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { WebResourceGridComponent } from './web-resource-grid.component';
import { WebResource } from './web-resource.model';
import { WebResourceFormDrawerComponent } from './web-resource-form-drawer.component';

import { NzPageHeaderCustomComponent } from 'src/app/third-party/ng-zorro/nz-page-header-custom/nz-page-header-custom.component';
import { NzSearchAreaComponent } from 'src/app/third-party/ng-zorro/nz-search-area/nz-search-area.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { WebResourceSearchComponent } from './web-resource-search.component';

@Component({
  selector: 'web-resource-app',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzPageHeaderCustomComponent,
    NzSearchAreaComponent,
    WebResourceGridComponent,
    WebResourceFormDrawerComponent,
    WebResourceSearchComponent,
    ShapeComponent
],
  template: `
<ng-template #header>
  <nz-page-header-custom title="리소스 등록" subtitle="This is a subtitle"></nz-page-header-custom>
</ng-template>

<ng-template #search>
  <app-nz-search-area>
    <app-web-resource-search
      (search)="getList($event)"
      (newForm)="newResource()"
      (deleteForm)="delete()"
    />
  </app-nz-search-area>
</ng-template>

<app-shape [header]="{template: header, height: 'var(--page-header-height)'}" [search]="{template: search, height: 'var(--page-search-height)'}">
  <div class="container">
    <div>
      <h3 class="grid-title">웹서버 리소스 목록</h3>
    </div>

    <div style="flex: 1">
    @defer {
      <app-web-resource-grid #grid
        (rowClicked)="resourceGridRowClicked($event)"
        (editButtonClicked)="editResource($event)"
        (rowDoubleClicked)="editResource($event)">
      </app-web-resource-grid>
    }
    </div>
  </div>
</app-shape>


<app-web-resource-form-drawer
  [drawer]="drawer.resource"
  (drawerClosed)="getList('1')">
</app-web-resource-form-drawer>
  `,
  styles: `
:host {
  --page-header-height: 98px;
  --page-search-height: 46px;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.grid-title {
  height: 26px;
  margin-top: 6px;
  margin-left: 6px;
  padding-left: 6px;
  border-left: 6px solid green;
  vertical-align: text-top;
}
`
})
export class WebResourceApp implements OnInit {

  private http = inject(HttpClient);

  grid = viewChild.required(WebResourceGridComponent);

  drawer: {
    resource: { visible: boolean, formDataId: any }
  } = {
    resource: { visible: false, formDataId: null }
  }

  ngOnInit(): void {
  }

  getList(params: any): void {
    /*
    let params: any = new Object();
    if ( this.query.resource.value !== '') {
      params[this.query.resource.key] = this.query.resource.value;
    }
    */
    console.log(params);
    this.drawer.resource.visible = false;
    this.grid().gridQuery.set(params);
  }

  newResource(): void {
    this.drawer.resource.formDataId = null;
    this.drawer.resource.visible = true;
  }

  editResource(item: any): void {
    this.drawer.resource.formDataId = item.resourceId;
    this.drawer.resource.visible = true;
  }

  delete(): void {
    const id = this.grid().getSelectedRows()[0].resourceId;

    const url = GlobalProperty.serverUrl() + `/api/system/webresource/${id}`;
    const options = getHttpOptions();
    this.http.delete<ResponseObject<WebResource>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseObject<WebResource>) => {
        //this.notifyService.changeMessage(model.message);
        this.getList('');
      }
    );

  }

  resourceGridRowClicked(item: any): void {
    this.drawer.resource.formDataId = item.resourceId;
  }

}
