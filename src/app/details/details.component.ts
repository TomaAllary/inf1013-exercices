import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Student} from "../models/Student";
import {Score} from "../models/Score";
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @Input() student?: Student;

  @Output() studentChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

}
