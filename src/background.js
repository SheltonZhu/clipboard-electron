"use strict";
import { app, protocol } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import clipboard from "electron-clipboard-extended";
import uuid from "uuid";
import initTray from "./main/tray";
import initShortCut from "./main/shortcut";
import WindowManager from "./main/windows";
import db from "./main/db";

let windowManager = new WindowManager();
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

clipboard
  .on("text-changed", () => {
    let currentText = clipboard.readText();
    let data = {
      id: uuid(),
      copyType: "text",
      copyTime: new Date(),
      copyContent: currentText,
      otherInfo: currentText.length
    };
    db.addOneData("historyData", data);
    windowManager.mainWindowSafe.webContents.send(
      "clipboard-text-changed",
      data
    );
  })
  .on("image-changed", () => {
    let currentIMage = clipboard.readImage();
    console.log(currentIMage.getSize());
  })
  .startWatching();

// Quit when all windows are closed.
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
    let win = await windowManager.initMainWindow();
    windowManager.setMainWindow(win);
    initTray();
    initShortCut();
    await db.initMyDB();
    let initData = db.getAllData("historyData");
    if (initData) {
      initData = initData.reverse();
    } else {
      initData = [];
    }
    win.webContents.send("init-data", initData);
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
