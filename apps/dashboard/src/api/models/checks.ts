export interface Check {
  id: string;
  statusCode: number;
  timing: Timing;
  tls: TLS;
  createdAt: string;
}
export interface Timing {
  dnsLookup: number;
  tcpConnection: number;
  tlsHandshake: number;
  serverProcessing: number;
  contentTransfer: number;
  total: number;
}

export interface TLS {
  version: string;
  cipher: string;
  issuer: string;
  subject: string;
  notBefore: Date;
  notAfter: Date;
}
