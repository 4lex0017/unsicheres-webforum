import {User} from "./user";

export interface Post{
  id: number;
  content: string;
  date: string;
  author: User;
}
