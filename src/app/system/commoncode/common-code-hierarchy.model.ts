export class CommonCodeHierarchy {
  constructor(
    public id: string,
    public systemTypeCode: string,
    public code: string,
    public codeName: string,
    public codeNameAbbreviation: string,
    public fromDate: string,
    public toDate: string,
    public hierarchyLevel: number,
    public fixedLengthYn: boolean,
    public codeLength: number,
    public cmt: string,
    public parentId: string,
    public title: string,
    public key: string,
    public isLeaf: boolean,
    public children: CommonCodeHierarchy[]) { }
}
