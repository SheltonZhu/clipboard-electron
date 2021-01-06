import config from "electron-cfg";
import AppDirectory from "appdirectory";
import pkg from "@/../package.json";

const isDevelopment = process.env.NODE_ENV !== "production";

config.set("isDevelopment", isDevelopment);
config.set(
  "helpInfo",
  "【Esc】: 隐藏剪切板\n【Alt+V】: 呼出剪贴板\n【Enter】: 粘贴选中\n【→】: 选中下一个\n【←】: 选中上一个"
);
config.set("github", pkg.github);
config.set(
  "about",
  `Version: ${pkg.version}\nAuthor: ${pkg.author}\nGithub: ${pkg.github}\nDescription: ${pkg.description}`
);

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
