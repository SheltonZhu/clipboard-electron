import log from "electron-log";
import config from "electron-cfg";

const isDevelopment = config.get("isDevelopment");
log.transports.file.getFile();
if (isDevelopment) {
  log.transports.file.level = false;
} else {
  log.transports.console.level = false;
  log.transports.file.level = config.get("logLevel", "error");
}
export default log;
