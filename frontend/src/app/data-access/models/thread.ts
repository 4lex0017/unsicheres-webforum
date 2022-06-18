import {Post} from "./post";
import {User} from "./user";

export interface Thread {
  id: number;
  title: string;
  author: User;
  likedFrom: number[];
  posts: Post[];
  date: string;
}
