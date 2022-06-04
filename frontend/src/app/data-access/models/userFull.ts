import {UserComment} from "./comment";
import {ElementRef} from "@angular/core";

export interface UserFull {
  id: number;
  username: string;
  joined: string;
  about: string;
  role: string[];
  comments: UserComment[];
  image?: string;

  location?: string;
  birthDate: string
}
