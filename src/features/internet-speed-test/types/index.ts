export interface ClientInfo {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
}

export interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType: string;
  };
}
