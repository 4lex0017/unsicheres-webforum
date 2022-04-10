import {Thread} from "./thread";

export interface Category{
  id: number;
  title : string;
  threads: Thread[];
}
