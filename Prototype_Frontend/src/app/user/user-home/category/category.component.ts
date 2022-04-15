import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Category} from "../../../data-access/models/category";
import {MatTableDataSource} from "@angular/material/table";
import {Thread} from "../../../data-access/models/thread";
import {DataManagementService} from "../../../data-access/services/data-management.service";


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements AfterViewInit {
  @Input()
  categoryObject : Category ;

  @Input()
  showFull:boolean;
  @Output()
  showMoreEvent = new EventEmitter<any>();

  constructor(private dataManagement: DataManagementService) { }


  displayedColumns: string[] = ['author-icon','general-information', 'specific-information-header', 'specific-information-body']
  dataSource = new MatTableDataSource<Thread>();


  ngAfterViewInit(): void {
    this.dataManagement.notifyOthersObservable$.subscribe((id) => {
      for(let z = 0; z < this.categoryObject.threads.length; z++){
        if(this.categoryObject.threads[z].id == id){
          this.categoryObject.threads.splice(z, 1);
          break;
        }
      }
    })
  }
  showMoreTransmitter(showMore: boolean, showIndex: number){
    console.log({showMore: showMore, showIndex:showIndex})
    this.showMoreEvent.emit({showMore: showMore, showIndex:showIndex});
  }


}
