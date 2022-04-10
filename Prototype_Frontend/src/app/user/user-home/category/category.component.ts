import {Component, Input, OnInit} from '@angular/core';
import {Category} from "../../../data-access/models/category";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() categoryObject : Category;
  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = ['author-icon','general-information', 'specific-information-header', 'specific-information-body'];
}
