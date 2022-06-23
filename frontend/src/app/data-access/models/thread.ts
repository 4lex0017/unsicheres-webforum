import {Post} from "./post";
import {User} from "./user";

export interface Thread {
  id: number;
  categoryId?: number;
  title: string;
  author: User;
  likedFrom: number[];
  posts: Post[];
  date: string;
}
