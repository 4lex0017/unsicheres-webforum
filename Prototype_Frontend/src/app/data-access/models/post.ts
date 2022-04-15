import {User} from "./user";

export interface Post{
  id: number;
  content: string;
  date: string;
  endorsements: number,
  author: User;
  repliedTo?:string;
}
