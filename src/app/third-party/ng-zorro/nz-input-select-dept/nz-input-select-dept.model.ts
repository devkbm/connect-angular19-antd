export interface NzInputSelectDeptModel {
  deptId: string;
  deptCode: string;
  parentDeptCode: string;
  deptNameKorean: string;
  deptAbbreviationKorean: string;
  deptNameEnglish: string;
  deptAbbreviationEnglish: string;
  fromDate: Date;
  toDate: Date;
  seq: number;
  comment: string;
  [key:string]:any;
}
