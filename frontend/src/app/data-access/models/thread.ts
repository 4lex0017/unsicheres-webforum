import {Post} from "./post";
import {User} from "./user";

export interface Thread {
  id: number;
  title: string;
  content: string;
  date: string;
  author: User;
  posts: Post[];
  likedFrom: number[];
}
