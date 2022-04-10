import {Post} from "./post";
import {User} from "./user";

export interface Thread{
  id: number;
  title: string
  endorsements: number;
  author: User;
  posts: Post[];
}
