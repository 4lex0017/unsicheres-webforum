import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {AdminUser, AdminVulnerability} from "../../data-access/models/scoreboard";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ScoreboardComponent implements AfterViewInit, OnInit {
  allRowToggle = false;
  displayedColumns: string[] = ['score', 'ipaddress', 'username', 'vulnFound'];
  displayedInnerColumns: string[] = ['vulPoints', 'vulName', 'vulLevel'];
  dataSource
  scoreboard: AdminUser[] = [];

  constructor(private _liveAnnouncer: LiveAnnouncer,
              private backendCom: BackendCommunicationService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.backendCom.getScoreboard().subscribe((data: AdminUser[]) => {

      this.scoreboard = data;
      for (let i = 0; i < this.scoreboard.length; i++) {
        if (this.scoreboard[i].expanded == undefined) this.scoreboard[i].expanded = false;
      }
      this.dataSource = new MatTableDataSource(this.scoreboard);
    })
  }

  resetDatabase() {
    this.backendCom.resetDatabase().subscribe(value => {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Database has been reset.",
      })
    });
  }

  resetScoreboard() {
    this.backendCom.resetScoreboard().subscribe(value => {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Scoreboard has been reset.",
      })
    });
  }

  quickSort(vulnerabilities: AdminVulnerability[]): AdminVulnerability[] {
    return vulnerabilities.sort((v1, v2) => {
      if (v1.vulName > v2.vulName) return 1;
      else return -1;
    });
  }

  toggleRow(element: { expanded: boolean; }) {
    element.expanded = !element.expanded
  }

  manageAllRows() {
    this.allRowToggle = !this.allRowToggle
    this.scoreboard.forEach(row => {
      row.expanded = this.allRowToggle;
    })
  }

  getPoints(vulnerabilities: AdminVulnerability[]): number {
    let result = 0;
    for (let z = 0; z < vulnerabilities.length; z++) {
      result += vulnerabilities[z].vulLevel;
    }
    return result;
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'score':
          return this.getPoints(item.vulnerabilities);
        case 'vulnFound':
          return item.vulnerabilities.length;
        default:
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getUsername(name: string): string {
    if (name == null) return "N/A"
    return name;
  }


}
