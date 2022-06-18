export interface Scoreboard {
  categories: AdminUser[];
}


export interface AdminUser {
  ipaddress: string;
  username: string;
  vulnerabilities: AdminVulnerability[];
  expanded?: boolean;

}

export interface AdminVulnerability {
  vulName: string;
  vulLevel: number
}
