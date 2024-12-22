export interface ArticleList {
  boardId: string;
  articleId: string;
  writerName: string;
  writerImage: string;
  title: string;
  hitCount: number;
  editable: boolean;
  isAttachedFile: boolean;
  fileCount: number;
  isRead: boolean;
}
