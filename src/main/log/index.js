import log from "electron-log";
import config from "electron-cfg";
import path from "path";
const isDevelopment = config.get("isDevelopment");
if (isDevelopment) {
  log.transports.file.resolvePath = variables => {
    return path.join(process.cwd(), "log", variables.fileName);
  };
} else {
  log.transports.file.resolvePath = variables => {
    return path.join(config.get("dataPath"), "log", variables.fileName);
  };
  log.transports.file.level = config.get("logLevel", "error");
}
export default log;
