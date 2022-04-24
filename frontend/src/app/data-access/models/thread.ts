import {Post} from "./post";
import {User} from "./user";

export interface Thread{
  id: number;
  slug: string;
  title: string;
  content: string;
  date: string;
  endorsements: number;
  author: User;
  posts: Post[];
}
