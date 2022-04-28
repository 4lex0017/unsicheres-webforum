import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {animate, state, style, transition, trigger} from "@angular/animations";

export interface AdminUser {
  ipaddress: string;
  username: string;
  vulnerabilities: AdminVulnerability[];
  expanded: boolean;

}

export interface AdminVulnerability {
  vulId: number;
  vulName: string;
  vulPoints: number;
  vulLevel: string
}

const ELEMENT_DATA: AdminUser[] = [
  {
    ipaddress: '192.168 l78 2.1', username: 'Daniel', vulnerabilities: [
      {
        vulId: 1,
        vulName: 'XSS reflected',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 5,
        vulName: 'XSS stored',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 8,
        vulName: 'Insecure Password Handling',
        vulPoints: 5,
        vulLevel: 'easy'
      },
    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.6', username: 'Peter', vulnerabilities: [
      {
        vulId: 3,
        vulName: 'XSS reflected',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 4,
        vulName: 'XSS stored',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 8,
        vulName: 'Insecure Password Handling',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 9,
        vulName: 'Command Injection',
        vulPoints: 15,
        vulLevel: 'hard'
      },
    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.2', username: 'Lukas', vulnerabilities: [
      {
        vulId: 8,
        vulName: 'Insecure Password Handling',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 9,
        vulName: 'Command Injection',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 10,
        vulName: 'Insecure File Upload',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 11,
        vulName: 'Insecure File Upload',
        vulPoints: 15,
        vulLevel: 'hard'
      },
    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.15', username: 'Tom', vulnerabilities: [
      {
        vulId: 2,
        vulName: 'XSS reflected',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 3,
        vulName: 'XSS reflected',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 4,
        vulName: 'XSS stored',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 5,
        vulName: 'XSS stored',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 6,
        vulName: 'XSS stored',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 7,
        vulName: 'User authentication: Brute Force',
        vulPoints: 10,
        vulLevel: 'medium'
      },
    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.12', username: 'Doniel', vulnerabilities: [{
      vulId: 6,
      vulName: 'XSS stored',
      vulPoints: 15,
      vulLevel: 'hard'
    },
      {
        vulId: 7,
        vulName: 'User authentication: Brute Force',
        vulPoints: 10,
        vulLevel: 'medium'
      },], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.7', username: 'Tim', vulnerabilities: [
      {
        vulId: 9,
        vulName: 'Command Injection',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 10,
        vulName: 'Insecure File Upload',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 11,
        vulName: 'Insecure File Upload',
        vulPoints: 15,
        vulLevel: 'hard'
      },
    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.22', username: 'Felix', vulnerabilities: [{
      vulId: 8,
      vulName: 'Insecure Password Handling',
      vulPoints: 5,
      vulLevel: 'easy'
    },
      {
        vulId: 9,
        vulName: 'Command Injection',
        vulPoints: 15,
        vulLevel: 'hard'
      },], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.13', username: 'Test1', vulnerabilities: [
      {
        vulId: 2,
        vulName: 'XSS reflected',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 3,
        vulName: 'XSS reflected',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 4,
        vulName: 'XSS stored',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 5,
        vulName: 'XSS stored',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 6,
        vulName: 'XSS stored',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 7,
        vulName: 'User authentication: Brute Force',
        vulPoints: 10,
        vulLevel: 'medium'
      },

    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.22', username: 'Test2', vulnerabilities: [
      {
        vulId: 1,
        vulName: 'XSS reflected',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 2,
        vulName: 'XSS reflected',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 3,
        vulName: 'XSS reflected',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 4,
        vulName: 'XSS stored',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 5,
        vulName: 'XSS stored',
        vulPoints: 10,
        vulLevel: 'medium'
      },
    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.60', username: 'Test3', vulnerabilities: [{
      vulId: 8,
      vulName: 'Insecure Password Handling',
      vulPoints: 5,
      vulLevel: 'easy'
    },
      {
        vulId: 9,
        vulName: 'Command Injection',
        vulPoints: 15,
        vulLevel: 'hard'
      },], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.114', username: 'Test4', vulnerabilities: [
      {
        vulId: 1,
        vulName: 'XSS reflected',
        vulPoints: 5,
        vulLevel: 'easy'
      },
    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.123', username: 'Test5', vulnerabilities: [{
      vulId: 5,
      vulName: 'XSS stored',
      vulPoints: 10,
      vulLevel: 'medium'
    },
      {
        vulId: 6,
        vulName: 'XSS stored',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 7,
        vulName: 'User authentication: Brute Force',
        vulPoints: 10,
        vulLevel: 'medium'
      },], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.76', username: 'Test6', vulnerabilities: [
      {
        vulId: 9,
        vulName: 'Command Injection',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 10,
        vulName: 'Insecure File Upload',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 11,
        vulName: 'Insecure File Upload',
        vulPoints: 15,
        vulLevel: 'hard'
      },
    ], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.87', username: 'Test7', vulnerabilities: [{
      vulId: 6,
      vulName: 'XSS stored',
      vulPoints: 15,
      vulLevel: 'hard'
    },
      {
        vulId: 7,
        vulName: 'User authentication: Brute Force',
        vulPoints: 10,
        vulLevel: 'medium'
      },], expanded: false
  },
  {
    ipaddress: '192.168 l78 2.123', username: 'Oxygen', vulnerabilities: [
      {
        vulId: 1,
        vulName: 'XSS reflected',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 2,
        vulName: 'XSS reflected',
        vulPoints: 10,
        vulLevel: 'medium'
      },
      {
        vulId: 3,
        vulName: 'XSS reflected',
        vulPoints: 15,
        vulLevel: 'hard'
      },
      {
        vulId: 4,
        vulName: 'XSS stored',
        vulPoints: 5,
        vulLevel: 'easy'
      },
      {
        vulId: 5,
        vulName: 'XSS stored',
        vulPoints: 10,
        vulLevel: 'medium'
      },
    ], expanded: false
  }
];

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
export class ScoreboardComponent implements AfterViewInit {

  displayedColumns: string[] = ['score', 'ipaddress', 'username', 'vulnFound'];
  displayedInnerColumns: string[] = ['vulPoints', 'vulName', 'vulLevel'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);


  constructor(private _liveAnnouncer: LiveAnnouncer) {
  }

  quickSort(vulnerabilities: AdminVulnerability[]): AdminVulnerability[] {
    return vulnerabilities.sort((v1, v2) => {
      if (v1.vulName > v2.vulName) return 1;
      else return -1;
    });
  }

  toggleRow(element: { expanded: boolean; }) {
    // Uncommnet to open only single row at once
    // ELEMENT_DATA.forEach(row => {
    //   row.expanded = false;
    // })
    element.expanded = !element.expanded
  }

  manageAllRows() {
    ELEMENT_DATA.forEach(row => {
      row.expanded = !row.expanded;
    })
  }

  getPoints(vulnerabilities: AdminVulnerability[]): number {
    let result = 0;
    for (let z = 0; z < vulnerabilities.length; z++) {
      result += vulnerabilities[z].vulPoints;
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
