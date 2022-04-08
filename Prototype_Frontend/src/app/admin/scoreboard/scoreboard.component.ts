import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

export interface users {
  vorname: string;
  nachname: string;
  score: number;
  vulnFound: number;

}

const ELEMENT_DATA: users[] = [
  {score: 100, vorname: 'Daniel', nachname: 'Daniel', vulnFound: 10},
  {score: 30, vorname: 'Peter', nachname: 'Peter', vulnFound: 8},
  {score: 15, vorname: 'Lukas', nachname: 'Lukas', vulnFound: 2},
  {score: 35, vorname: 'Tom', nachname: 'Tom', vulnFound: 8},
  {score: 144, vorname: 'Doniel', nachname: 'Doniel', vulnFound: 14},
  {score: 23, vorname: 'Tim', nachname: 'Tim', vulnFound: 5},
  {score: 1, vorname: 'Felix', nachname: 'Felix', vulnFound: 1},
  {score: 13, vorname: 'Test1', nachname: 'Test1', vulnFound: 2},
  {score: 135, vorname: 'Test2', nachname: 'Test2', vulnFound: 13},
  {score: 41, vorname: 'Test3', nachname: 'Test3', vulnFound: 2},
  {score: 81, vorname: 'Test4', nachname: 'Test4', vulnFound: 5},
  {score: 131, vorname: 'Test5', nachname: 'Test5', vulnFound: 7},
  {score: 100, vorname: 'Test6', nachname: 'Test6', vulnFound: 5},
  {score: 19, vorname: 'Test7', nachname: 'Test7', vulnFound: 3},
  {score: -5, vorname: 'Hydrogen', nachname: 'Oxygen', vulnFound: -1}
];

@Component({
  selector: 'admin-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements AfterViewInit {

  displayedColumns: string[] = ['score', 'vorname', 'nachname', 'vulnFound'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
