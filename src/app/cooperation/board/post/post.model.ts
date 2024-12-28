import { PostRead } from './post-read.model';

export interface Post {
  postId: string;
  boardId: string;
  postParentId: string;
  userId: string;
  title: string;
  contents: string;
  pwd: string;
  hitCnt: string;
  fromDate: string;
  toDate: string;
  seq: number;
  depth: number;
  articleChecks: PostRead[];
  fileList: string[];
  file: File;
  editable: boolean
}
