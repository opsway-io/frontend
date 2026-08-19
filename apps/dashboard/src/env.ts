export interface Environment {
  MOCKED: boolean;
  API_BASE_URL: string;
  SOCIAL_LOGIN: boolean;
}

const ENV: Environment = {
  MOCKED: false,
  API_BASE_URL: "",
  SOCIAL_LOGIN: false,
};

const covertToType = (value: any) => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === "null") {
    return null;
  }

  if (!isNaN(value)) {
    return Number(value);
  }

  return value;
};

for (const key in ENV) {
  if (
    Object.prototype.hasOwnProperty.call(import.meta.env || {}, `VITE_${key}`)
  ) {
    (ENV as any)[key] = covertToType(import.meta.env[`VITE_${key}`]);
  }

  if (
    Object.prototype.hasOwnProperty.call((window as any).SERVER_DATA || {}, key)
  ) {
    (ENV as any)[key] = (window as any).SERVER_DATA[key];
  }
}

// For debugging purposes
(window as any).environment = ENV;
console.table(ENV);

export default ENV;
