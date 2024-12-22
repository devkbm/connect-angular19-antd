export interface Dept {
  parentDeptCode: string | null;
  //deptId: string | null;
  deptCode: string | null;
  deptNameKorean: string | null;
  deptAbbreviationKorean: string | null;
  deptNameEnglish: string | null;
  deptAbbreviationEnglish: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  seq: number | null;
  comment: string | null;
}
