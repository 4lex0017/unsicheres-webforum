import {
  AfterViewInit,
  Component,
  Input,

} from '@angular/core';
import {Category} from "../../../data-access/models/category";
import {MatTableDataSource} from "@angular/material/table";
import {Thread} from "../../../data-access/models/thread";
import {DataManagementService} from "../../../data-access/services/data-management.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements AfterViewInit {
  @Input()
  categoryObject: Category;
  @Input()
  showFull: boolean;

  constructor(private dataManagement: DataManagementService, private router: Router) {
  }


  displayedColumns: string[] = ['author-icon', 'general-information', 'specific-information-header', 'specific-information-body']
  dataSource = new MatTableDataSource<Thread>();


  ngAfterViewInit(): void {
    this.dataManagement.notifyOthersObservable$.subscribe((id) => {
      for (let z = 0; z < this.categoryObject.threads.length; z++) {
        if (this.categoryObject.threads[z].id == id) {
          this.categoryObject.threads.splice(z, 1);
          break;
        }
      }
    })
  }

  getSLugFromTitle(title: string): string {
    return title.replace(/\s+/g, '-').toLowerCase();
  }

  showMoreNav(category: string) {
    this.router.navigate(['forum/home'], {queryParams: {view: category}});

  }


}
