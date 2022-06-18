import {Thread} from "./thread";
import {User} from "./user";
import {Post} from "./post";

export interface Category {
  id: number;
  title: string;
  threads: Thread[];
}

