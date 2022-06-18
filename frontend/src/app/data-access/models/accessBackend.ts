import {User} from "./user";

export interface AccessBackend {
  categories: CategoryBackend[];
}

export interface CategoryBackend {
  id: number;
  title: string;
  threads: ThreadCategory[];
}


export interface ThreadCategory {
  id: number;
  title: string;
  author: User;
  likedFrom: number[];
  numberOfPosts: number;
}
