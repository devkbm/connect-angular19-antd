import { ArticleRead } from './article-read.model';

export interface Article {
  articleId: string;
  boardId: string;
  articleParentId: string;
  title: string;
  contents: string;
  pwd: string;
  hitCnt: string;
  fromDate: string;
  toDate: string;
  seq: number;
  depth: number;
  articleChecks: ArticleRead[];
  fileList: string[];
  file: File;
  editable: boolean
}
