import {UserComment} from "./comment";
import {ElementRef} from "@angular/core";

export interface UserFull {
  id: number;
  name: string;
  joined: string;
  about: string;
  groups: string[];
  profile_comments: UserComment[];
  profile_picture?: string;
  location?: string;
  birth_date: string
}
