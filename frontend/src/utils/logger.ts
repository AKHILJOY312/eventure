const isDev = import.meta.env.DEV;

export const logger = {
  info: (...args: any[]) => {
    if (isDev) console.info("info:", ...args);
  },
  debug: (...args: any[]) => {
    if (isDev) console.log("debug:", ...args);
  },
  error: (...args: any[]) => {
    if (isDev) console.error("error:", ...args);
  },
};
