export interface PostList {
  boardId: string;
  postId: string;
  writerName: string;
  writerImage: string;
  title: string;
  hitCount: number;
  editable: boolean;
  isAttachedFile: boolean;
  fileCount: number;
  isRead: boolean;
}
