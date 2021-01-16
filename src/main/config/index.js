import config from "electron-cfg";
import AppDirectory from "appdirectory";
import pkg from "@/../package.json";
import path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";
if (isDevelopment) {
  config.file(path.join(process.cwd(), "config.json"));
} else {
  let dirs = new AppDirectory({
    appName: pkg.productName,
    useRoaming: true
  });
  config.file(path.join(dirs.userData(), "config.json"));
  if (!config.get("dataPath", null)) config.set("dataPath", dirs.userData());
}

config.set("isDevelopment", isDevelopment);
config.set(
  "helpInfo",
  "【Esc】: 隐藏剪切板\n【Alt+V】: 呼出剪贴板\n【Enter】: 粘贴选中\n【→】: 选中下一个\n【←】: 选中上一个\n【Alt+[】: 切换为上一个标签\n【Alt+]】: 切换为下一个标签\n【Alt+S】: 搜索"
);
config.set("github", pkg.github);
config.set(
  "about",
  `Version: ${pkg.version}\nAuthor: ${pkg.author}\nGithub: ${pkg.github}\nDescription: ${pkg.description}`
);
config.set("bgList", ["/bg/default.png", "/bg/bg1.png", "/bg/bg2.png"]);
let initKeyMap = {
  logLevel: "error",
  initCopyContent: "Thank you for using!!!!",
  initLink: "https://www.bilibili.com/",
  defaultIcon: "/default_icon.png",
  bgBlur: true,
  bgPic: true,
  imageUrl: "/bg/default.png",
  defaultBg: "/bg/default.png",
  bgColor: "#ffffffbf",
  autoBoot: false,
  directPaste: true,
  hideWhenBlur: true,
  trayIcon: true,
  historyCapacity: 1,
  historyCapacityNum: 50,
  iconEnable: true,
  regexList: []
};
for (let key in initKeyMap) {
  if (config.get(key, undefined) === undefined)
    config.set(key, initKeyMap[key]);
}

export default config;
