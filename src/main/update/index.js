import { dialog, shell } from "electron";
import { autoUpdater } from "electron-updater";
import config from "@/main/config";
import SettingsWindow from "@/main/windows/settings";
import log from "@/main/log";
const updateLog = log.scope("update");
const isDevelopment = config.get("isDevelopment");
export default class AutoUpdater {
  constructor() {
    autoUpdater.autoDownload = false; // 不自動下載更新檔
    this.createListener();
    autoUpdater.checkForUpdates();
  }

  createListener() {
    // 没有更新
    autoUpdater.on("update-not-available", info => {
      updateLog.info("has no new version: ", info);
    });

    // 有更新檔可下載
    autoUpdater.on("update-available", info => {
      updateLog.info("has new version: ", info);
      if (isDevelopment) {
        const dialogOpts = {
          type: "info",
          buttons: ["Yes", "No"],
          title: "发现新版本",
          message: `发现先版本: ${info.version}`,
          detail: "是否下载新版本?"
        };
        dialog.showMessageBox(dialogOpts).then(returnValue => {
          if (returnValue.response === 0) {
            // if selected yes
            shell.openExternal(info.files[0].url).then();
          }
        });
      } else {
        SettingsWindow.browserWindow.webContents.send(
          "update",
          info.files[0].url
        );
      }
    });

    // 下載進度，開始下載後會持續觸發此事件
    autoUpdater.on("download-progress", info => {
      updateLog.info(info.percent);
      updateLog.info("downloading: ", info.percent);
    });

    // 下载完成
    autoUpdater.on(
      "update-downloaded",
      (event, releaseNotes, releaseName, releaseDate, updateUrl) => {
        updateLog.info("downloaded: ", releaseName, releaseDate, updateUrl);
        const dialogOpts = {
          type: "info",
          buttons: ["立即安装", "稍后安装"],
          title: "应用更新",
          message: process.platform === "win32" ? releaseNotes : releaseName,
          detail: "新版本已经下载完毕. 重启应用程序来更新应用。"
        };
        dialog.showMessageBox(dialogOpts).then(returnValue => {
          if (returnValue.response === 0) autoUpdater.quitAndInstall();
        });
      }
    );
    autoUpdater.on("error", e => {
      updateLog.error("update err", e.toString());
    });
  }
}
