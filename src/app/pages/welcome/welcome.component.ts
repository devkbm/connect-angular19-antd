import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { ButtonTemplate, NzButtonsComponent } from 'src/app/third-party/ng-zorro/nz-buttons/nz-buttons.component';
import { NzInputCkeditorComponent } from 'src/app/third-party/ckeditor/nz-input-ckeditor.component';
import { NzInputDateTimeComponent } from 'src/app/third-party/ng-zorro/nz-input-datetime/nz-input-datetime.component';

import { NzInputRadioGroupComponent } from 'src/app/third-party/ng-zorro/nz-input-radio-group/nz-input-radio-group.component';

import { DutyDateListComponent } from './duty-date-list.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormItemCustomComponent } from 'src/app/third-party/ng-zorro/nz-form-item-custom/nz-form-item-custom.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputSelectComponent } from 'src/app/third-party/ng-zorro/nz-input-select/nz-input-select.component';

@Component({
  selector: 'app-welcome',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzFormItemCustomComponent,
    NzCheckboxModule,
    NzButtonsComponent,
    NzInputCkeditorComponent,
    NzInputDateTimeComponent,
    NzInputRadioGroupComponent,
    DutyDateListComponent,
    NzInputSelectComponent
  ],
  templateUrl: './welcome.component.html',
  styles: `
  `
})
export class WelcomeComponent implements OnInit {

  title = 'angular-forms-example';
  fg!: FormGroup;

  selectList = [{value: 'HRM', label: 'HRM'}, {value: 'HRM2', label: 'HRM2'}]

  treeList: NzTreeNodeOptions[] = [
    {
      key: 'title1',
      title: '제목1',
      isLeaf: false,
      children: [
        {
          key: 'content1',
          title: '본문1',
          isLeaf: true
        },
        {
          key: 'content1',
          title: '본문2',
          isLeaf: true
        },
      ]
    },
    {
      key: 'title2',
      title: '제목2',
      isLeaf: false,
      children: [
      ]
    }
  ];

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

  constructor(private fb: FormBuilder) {
    this.fg = this.fb.group({
      input_text: ['test', [ Validators.required ]],
      input_textarea: ['text area', [ Validators.required ]],
      input_date: [formatDate(new Date(),'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'), [ Validators.required ]],
      input_number: [1, [ Validators.required ]],
      input_select: [null, [ Validators.required ]],
      input_treeselect: [null, [ Validators.required ]],
      input_deptselect: [null, [ Validators.required ]],
      input_color: [null]
    });
  }

  ngOnInit() {
  }

  custom_label(option: any, i: number): any {
    return option.label + ' ' + i;
  }

}
