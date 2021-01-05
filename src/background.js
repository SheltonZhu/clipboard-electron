"use strict";
import { app, protocol } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import clipboard from "electron-clipboard-extended";
import initTray from "@/main/tray";
import initShortCut from "@/main/shortcut";
import WindowManager from "@/main/windows";
import config from "@/main/config";
import log from "@/main/log";
import db from "@/main/db/stores/clipboardItem";
import labelDb from "@/main/db/stores/labelItem";

global.db = db;
global.labelDb = labelDb;

let windowManager = new WindowManager();
const isDevelopment = config.get("isDevelopment");
const gotTheLock = app.requestSingleInstanceLock();

//进程锁
if (!gotTheLock) {
  app.quit();
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

clipboard
  .on("text-changed", async () => {
    let currentText = clipboard.readText();
    // let isLink = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
    let isLink = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
      currentText.trim()
    );
    let data = {
      table: "historyData",
      copyType: "Text",
      copyTime: new Date(),
      copyContent: currentText,
      otherInfo: { characterLength: currentText.length }
    };
    if (isLink) {
      data.copyType = "Link";
      data.copyContent = data.copyContent.trim();
    }
    windowManager.mainWindowSafe.webContents.send(
      "clipboard-text-changed",
      await db.create(data)
    );
  })
  .on("image-changed", async () => {
    let currentIMage = clipboard.readImage();
    let image = {
      table: "historyData",
      copyType: "Image",
      copyTime: new Date(),
      copyContent: currentIMage.toDataURL(),
      otherInfo: currentIMage.getSize()
    };
    windowManager.mainWindowSafe.webContents.send(
      "clipboard-image-changed",
      await db.create(image)
    );
  })
  .startWatching();

app
  .on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS);
      } catch (e) {
        console.error("Vue Devtools failed to install:", e.toString());
      }
    }
    try {
      await db.initData();
      await labelDb.initData();
    } catch (e) {
      log.error("[main]: initData fail: ", e.toString());
    }
    windowManager.setMainWindow(await windowManager.initMainWindow());
    initTray();
    initShortCut();

    // win.webContents.send("init-data", initData);
  })
  .on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windowManager.hasWindows()) windowManager.initMainWindow();
  })
  .on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  })
  .on("quit", () => {
    clipboard.stopWatching();
    if (app.hasSingleInstanceLock()) app.releaseSingleInstanceLock();
  });
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// autoUpdater.setFeedURL({
//   provider: "generic", // 亦可使用 Github
//   url: "your url"
// });
// autoUpdater.autoDownload = false; // 不自動下載更新檔
//
// // 有更新檔可下載
// autoUpdater.on("update-available", info => {
//   // do something...
// });
// // 沒有更新檔可下載
// autoUpdater.on("update-not-available", info => {
//   // do something...
// });
// // 下載進度，開始下載後會持續觸發此事件
// autoUpdater.on("download-progress", info => {
//   console.log(info.percent);
// });
// // 下載完成
// autoUpdater.on(
//   "update-downloaded",
//   (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
//     autoUpdater.quitAndInstall();
//   }
// );
// // 錯誤
// autoUpdater.on("error", function() {
//   // do something...
// });
//
// // 開始下載更新
// autoUpdater.checkForUpdates();
