export interface Metric {
  name: string;
  timing: Timing[];
}

export interface Timing {
  timing: number;
  start: string;
}
