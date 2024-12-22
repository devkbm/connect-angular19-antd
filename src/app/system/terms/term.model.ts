export interface Term {
  termId: string | null;
  system: string | null;
  term: string | null;
  termEng: string | null;
  columnName: string | null;
  dataDomainId: string | null;
  domainName?: string | null;
  description: string | null;
  comment: string | null;
}
