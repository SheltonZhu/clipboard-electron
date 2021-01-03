import config from "electron-cfg";
import AppDirectory from "appdirectory";
import fs from "fs";
import path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";

let dirs = new AppDirectory({
  appName: "Clipboard",
  useRoaming: true
});
if (!isDevelopment) {
  if (!config.get("dataPath", null)) config.set("dataPath", dirs.userData());

  const mkdirsSync = dirname => {
    if (fs.existsSync(dirname)) return true;
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  };
  mkdirsSync(dirs.userCache());
}
let initKeyMap = {
  dataEncodeKey: "0123456787654321",
  initCopyContent: "Thank you for using!!!!"
};
for (let key in initKeyMap)
  if (!config.get(key, null)) config.set(key, initKeyMap[key]);
export default config;
