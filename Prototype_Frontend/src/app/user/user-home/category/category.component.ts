import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Category} from "../../../data-access/models/category";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Thread} from "../../../data-access/models/thread";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements AfterViewInit {
  @Input()
  categoryObject : Category ;
  shortThreads : Thread[];
  @ViewChild(MatPaginator) paginator : MatPaginator;
  constructor() { }


  displayedColumns: string[] = ['author-icon','general-information', 'specific-information-header', 'specific-information-body']
  // displayedColumns: string[] = ['slug','title', 'content', 'date']
  dataSource = new MatTableDataSource<Thread>();


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


}
