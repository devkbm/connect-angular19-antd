export interface CommonCode {
  systemTypeCode: string | null;
  codeId: string | null;
  parentId: string | null;
  code: string | null;
  codeName: string | null;
  codeNameAbbreviation: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  seq: number | null;
  hierarchyLevel: number | null;
  lowLevelCodeLength: number | null;
  cmt: string | null;
}
