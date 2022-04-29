import {User} from "./user";
import {PostReply} from "./postReply";

export interface Post {
  id: number;
  content: string;
  date: string;
  endorsements: number,
  author: User;
  repliedTo?: PostReply;
  // idReplyToPost: number
}
