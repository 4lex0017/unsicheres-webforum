export interface VulnerabilitiesConfig {
  data: Config[]
}


export interface Config {
  uri: string;
  sqli_difficulty?: number;
  sxss_difficulty?: number;
  rxss_difficulty?: number;
}

export interface PutConfig {
  data: PutConfigStates[];
}

export interface PutConfigStates {
  id: number
  difficulty: PutConfigStatesDifficulty;
}

export interface PutConfigStatesDifficulty {
  1: boolean;
  2: boolean;
  3: boolean;
  4?: boolean;
}


