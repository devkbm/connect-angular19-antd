export interface BoardHierarchy {
  createdDt: Date;
  createdBy: string;
  modifiedDt: Date;
  modifiedBy: string;
  boardId: string;
  boardParentId: string;
  boardName: string;
  boardDescription: string;
  fromDate: Date;
  toDate: Date;
  articleCount: number;
  sequence: number;
  selected: boolean;
  expanded: boolean;
  isLeaf: boolean;
  active: boolean;
  children: BoardHierarchy[];
  title: string;
  key: string;
}
