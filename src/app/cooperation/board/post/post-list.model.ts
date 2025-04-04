export interface PostList {
  boardId: string;
  postId: string;
  writerId: string;
  writerName: string;
  writerImage: string;
  title: string;
  hitCount: number;
  editable: boolean;
  isAttachedFile: boolean;
  fileCount: number;
  isRead: boolean;
}
