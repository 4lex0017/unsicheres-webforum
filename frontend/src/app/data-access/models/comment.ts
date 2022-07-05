export interface UserComment {
  author: number;
  authorName: string;
  content: string;
  date: string;
}

export interface UserCommentWrapper {
  data: UserComment[]
}

