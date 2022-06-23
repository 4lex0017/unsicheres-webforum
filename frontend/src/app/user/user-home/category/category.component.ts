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
import {BackendService} from "../../../data-access/services/backend.service";
import {CategoryBackend} from "../../../data-access/models/accessBackend";
import {BackendCommunicationService} from "../../../data-access/services/backend-communication.service";


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements AfterViewInit {
  @Input()
  categoryObject: CategoryBackend;
  @Input()
  showFull: boolean;

  constructor(private dataManagement: DataManagementService, private router: Router, private backend: BackendService, private backendCom: BackendCommunicationService) {
  }


  displayedColumns: string[] = ['author-icon', 'general-information', 'specific-information-header', 'specific-information-body']
  dataSource = new MatTableDataSource<Thread>();


  ngAfterViewInit(): void {
    this.dataManagement.notifyOthersObservable$.subscribe((id) => {
      for (let z = 0; z < this.categoryObject.threads.length; z++) {
        if (this.categoryObject.threads[z].id == id) {
          this.backendCom.deleteThread(this.categoryObject.id, id).subscribe();
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
