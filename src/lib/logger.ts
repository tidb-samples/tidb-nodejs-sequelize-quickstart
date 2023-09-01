import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

export function getLogger(name?: string) {
  return logger.child({ name });
}

export default logger;
