import { Score } from './Score';

export class Student{
  fname: string;
  lname: string;
  score: Score[];

  constructor(fname: string, lname: string, score: Score[]) {
    this.fname = fname;
    this.lname = lname;
    this.score = score;
  }
}
