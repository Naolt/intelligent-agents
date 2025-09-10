import { fromUnixTime } from "date-fns";

const getCurrentDateAndTime = (): string => {
  const nowUtc = new Date().toISOString();

  return nowUtc;
};

const unixToUTC = (unix: number): string => {
  return fromUnixTime(unix).toISOString();
};

export { getCurrentDateAndTime, unixToUTC };
