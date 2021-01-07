"use strict";
import { app, protocol, BrowserWindow } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import clipboard from "electron-clipboard-extended";
import GlobalShortcut from "@/main/shortcut";
import config from "@/main/config";
import log from "@/main/log";
import db from "@/main/db/stores/clipboardItem";
import labelDb from "@/main/db/stores/labelItem";
import AppTray from "@/main/tray";
import WindowManager from "@/main/windows";
import AutoUpdater from "@/main/update";

global.db = db;
global.labelDb = labelDb;

const isDevelopment = config.get("isDevelopment");
const windowManager = new WindowManager();

//解决透明闪烁
app.commandLine.appendSwitch("wm-window-animations-disabled");

//进程锁
if (!app.requestSingleInstanceLock()) {
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
    windowManager.mainWindow.webContents.send(
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
    windowManager.mainWindow.webContents.send(
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
      log.error("[main]: init database fail: ", e.toString());
    }

    try {
      let [mainWin, settingsWin] = await windowManager.createWindows();
      if (mainWin && settingsWin) {
        new AppTray(mainWin, settingsWin).createTray();
        new GlobalShortcut(mainWin).createShortCut();
      }
    } catch (e) {
      log.error("[main]: init windows fail: ", e.toString());
    }
    try {
      new AutoUpdater();
    } catch (e) {
      log.error("[main]: init auto updater fail: ", e.toString());
    }
  })
  .on("activate", async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      await windowManager.createWindows();
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
