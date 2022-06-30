import {
  AfterViewInit, ChangeDetectorRef,
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
import {shareReplay} from "rxjs";


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

  vEnabled: number
  vEnabledFrontend: boolean;

  constructor(private dataManagement: DataManagementService,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private backend: BackendService,
              private backendServiceCom: BackendCommunicationService) {
  }


  displayedColumns: string[] = ['author-icon', 'general-information', 'specific-information-header', 'specific-information-body']
  dataSource = new MatTableDataSource<Thread>();


  async setVuln() {
    await this.backendServiceCom.getVulnerabilitySingle("/categories").then(value => {
        this.vEnabled = value
        this.vEnabledFrontend = this.isActive();
      }
    );
  }

  isActive(): boolean {
    return this.vEnabled != 0;
  }

  injectContentToDomStartup(): void {
    for (let i = 0; i < this.categoryObject.threads.length; i++) {

      this.changeDetectorRef.detectChanges();
      let title = document.getElementById("threadContent" + this.categoryObject.threads[i].id);
      title!.replaceChildren();
      title!.appendChild(document.createRange().createContextualFragment(this.categoryObject.threads[i].title));

      let user = document.getElementById('threadUser' + this.categoryObject.threads[i].author.id);
      user!.replaceChildren();
      user!.appendChild(document.createRange().createContextualFragment(this.categoryObject.threads[i].author.name));

    }
  }

  async ngAfterViewInit() {
    await this.setVuln();
    if (this.vEnabled != 0) this.injectContentToDomStartup();
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
