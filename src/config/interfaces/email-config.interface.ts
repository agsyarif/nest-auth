// interface IEmailAuth {
//   user: string;
//   pass: string;
// }

// export interface IEmailConfig {
//   host: string;
//   port: number;
//   secure: boolean;
//   auth: IEmailAuth;
// }

interface IEmailAuth {
  user: string;
  pass: string;
}

export interface IEmailConfig {
  key: string;
  domain: string
  auth: IEmailAuth;

  host: string;
  // port: number;
  // secure: boolean;
}