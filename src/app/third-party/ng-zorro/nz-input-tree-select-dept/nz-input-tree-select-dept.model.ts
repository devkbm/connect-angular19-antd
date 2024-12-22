export class NzInputTreeSelectDept {
  constructor(
    public parentDeptCode: string,
    public deptCode: string,
    public deptNameKorean: string,
    public deptAbbreviationKorean: string,
    public deptNameEnglish: string,
    public deptAbbreviationEnglish: string,
    public fromDate: string,
    public toDate: string,
    public seq: number,
    public comment: string,

    public title: string,
    public key: string,
    public isLeaf: boolean,
    public children: NzInputTreeSelectDept[]) {}
}
