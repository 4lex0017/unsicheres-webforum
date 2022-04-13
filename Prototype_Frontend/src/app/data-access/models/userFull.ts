import {UserComment} from "./comment";

export interface UserFull{
  id: number;
  username: string;
  joined: string;
  about: string;
  role: string[];
  comments: UserComment[];
}
