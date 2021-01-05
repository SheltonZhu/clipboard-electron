import config from "electron-cfg";
import AppDirectory from "appdirectory";
// import fs from "fs";
// import path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";

config.set("isDevelopment", isDevelopment);

if (!isDevelopment) {
  let dirs = new AppDirectory({
    appName: "Clipboard",
    useRoaming: true
  });
  if (!config.get("dataPath", null)) config.set("dataPath", dirs.userData());
}
let initKeyMap = {
  logLevel: "error",
  initCopyContent: "Thank you for using!!!!",
  initLink: "https://www.bilibili.com/"
};
for (let key in initKeyMap)
  if (!config.get(key, null)) config.set(key, initKeyMap[key]);
export default config;
