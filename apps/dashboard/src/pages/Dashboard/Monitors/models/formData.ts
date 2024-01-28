interface FormData {
  name: string;
  method: string;
  url: string;
  headers: { [key: string]: string }[];
  bodyType: string;
  body: string;
  frequencySeconds: number;
  locations: string[];
  assertions: {
    key: string;
    source: string;
    property: string;
    operator: string;
    target: string;
  }[];
  tls: {
    validate: {
      enabled: boolean;
    };
    expiration: {
      enabled: boolean;
      thresholdDays: number;
    };
  };
}

export type { FormData };
