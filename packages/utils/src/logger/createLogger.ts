export type Logger = {
  log: (message: string) => void;
};

export const createLogger = () => {
  return {
    log: (message: string) => {
      console.log(`${message}`);
    },
  };
};
