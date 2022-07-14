import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  Input,

} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Thread} from "../../../data-access/models/thread";
import {DataManagementService} from "../../../data-access/services/data-management.service";
import {Router} from "@angular/router";
import {CategoryBackend} from "../../../data-access/models/accessBackend";


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

  constructor(private dataManagement: DataManagementService,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  displayedColumns: string[] = ['author-icon', 'general-information', 'specific-information-header', 'specific-information-body']
  dataSource = new MatTableDataSource<Thread>();

  cutOffThreadTitle(title: string): string {
    if (title.length > 63) return title.substring(0, 60) + "...";
    return title;
  }

  cutOffAuthorName(title: string): string {
    if (title.length > 50) return title.substring(0, 50) + "...";
    return title;
  }

  injectContentToDomStartup(): void {
    for (let i = 0; i < this.categoryObject.threads.length; i++) {

      this.changeDetectorRef.detectChanges();
      let title = document.getElementById("threadContent" + this.categoryObject.threads[i].id);
      title!.replaceChildren();
      title!.appendChild(document.createRange().createContextualFragment(this.cutOffThreadTitle(this.categoryObject.threads[i].title)));

      let user = document.getElementById("username" + this.categoryObject.threads[i].id + '' + this.categoryObject.threads[i].author.id);
      user!.replaceChildren();
      user!.appendChild(document.createRange().createContextualFragment(this.cutOffAuthorName(this.categoryObject.threads[i].author.name)));
    }
  }

  ngAfterViewInit() {
    this.injectContentToDomStartup();
    this.dataManagement.notifyOthersObservable$.subscribe(({catId, threadId}) => {
      if (catId == this.categoryObject.id) {
        for (let z = 0; z < this.categoryObject.threads.length; z++) {
          if (this.categoryObject.threads[z].id == threadId) {
            this.categoryObject.threads.splice(z, 1);
            break;
          }
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
