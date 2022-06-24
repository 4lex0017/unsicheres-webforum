import {User} from "./user";
import {PostReply} from "./postReply";

export interface Post {
  id: number;
  content: string;
  date: string;
  author: User;
  likedFrom: number[];
  repliedTo?: PostReply;
}
