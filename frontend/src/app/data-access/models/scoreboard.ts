export interface Scoreboard {
  categories: AdminUser[];
}


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
