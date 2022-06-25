export interface PostsSmallBackendModel {
  data: PostSmall[];
}

export interface PostSmall {
  postId: number;
  threadId: number;
  content: string;
  date: string;
}
