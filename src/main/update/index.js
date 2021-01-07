import { autoUpdater } from "electron";
import config from "@/main/config";
import log from "@/main/log";

export default class AutoUpdater {
  constructor() {
    autoUpdater.setFeedURL({
      provider: "github", // 亦可使用 Github
      url: config.get("github")
    });
    autoUpdater.autoDownload = false; // 不自動下載更新檔
    this.createListener();
    autoUpdater.checkForUpdates();
  }

  createListener() {
    // 有更新檔可下載
    autoUpdater.on("update-available", info => {
      log.info("[main]: has new version: ", info);
    });
    // 沒有更新檔可下載
    autoUpdater.on("update-not-available", info => {
      log.info("[main]: has no new version: ", info);
    });
    // 下載進度，開始下載後會持續觸發此事件
    autoUpdater.on("download-progress", info => {
      console.log(info.percent);
      log.info("[main]: downloading: ", info.percent);
    });
    // 下載完成
    autoUpdater.on(
      "update-downloaded",
      (event, releaseNotes, releaseName, releaseDate, updateUrl) => {
        log.info("[main]: downloaded: ", releaseName, releaseDate, updateUrl);
        autoUpdater.quitAndInstall();
      }
    );
    // 錯誤
    autoUpdater.on("error", e => {
      log.error("[main]: update err", e.toString());
      // do something...
    });
  }
}
