import {UserComment} from "./comment";

export interface UserFullBackendModel {
  data: UserFullBackend[];
}

export interface UserFullBackend {
  id: number;
  name: string;
  joined: string;
  birthDate: string;
  about: string;
  groups: string[];
  profileComments: UserComment[];
  profilePicture: string;
  location: string;
  endorsements: number;
}


