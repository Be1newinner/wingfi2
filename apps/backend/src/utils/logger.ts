import pino, { multistream } from "pino";
import createWriteStream from "pino-elasticsearch";

export const streamToElastic = createWriteStream({
  index: "wingf-backend-logs",
  //   consistency: "one",
  node: "http://localhost:9200",
  flushInterval: 50,
  esVersion: 7,
});

const streams = multistream([
  // { stream: process.stdout }, // local terminal
  // { stream: streamToElastic }, // elastic
]);

const logger = pino(
  {
    level: "debug",
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  streams
);

export default logger;
