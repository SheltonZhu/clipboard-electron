"use strict";
import {
  app,
  BrowserWindow,
  ipcMain,
  nativeImage,
  protocol,
  screen
} from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import clipboard from "electron-clipboard-extended";
import { windowManager } from "node-window-manager";
import robot from "robotjs";
import GlobalShortcut from "@/main/shortcut";
import config from "@/main/config";
import log from "@/main/log";
import db from "@/main/db/stores/clipboardItem";
import labelDb from "@/main/db/stores/labelItem";
import cardIconDb from "@/main/db/stores/cardIconItem";
import AppTray from "@/main/tray";
import MainWindow from "@/main/windows/main";
import SettingsWindow from "@/main/windows/settings";
import AutoUpdater from "@/main/update";

global.db = db;
global.labelDb = labelDb;
global.cardIconDb = cardIconDb;
global.config = config;
global.shortcut = GlobalShortcut;
global.robot = robot;

const mainLog = log.scope("main");
const isDevelopment = config.get("isDevelopment");
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
ipcMain.on("settings", async (event, args) => {
  mainLog.info("settings: ", args);
  if (args.key !== "clearHistory") config.set(args.key, args.value);
  if (args.key === "trayIcon") {
    if (args.value) {
      await new AppTray().createTray();
    } else {
      if (AppTray.appTray) AppTray.appTray.destroy();
      AppTray.appTray = undefined;
    }
  } else if (args.key === "autoBoot") {
    app.setLoginItemSettings({
      openAtLogin: args.value
    });
  } else if (args.key === "hideWhenBlur") {
    if (args.value) {
      MainWindow.browserWindow.on("blur", MainWindow.browserWindow.hide);
    } else {
      MainWindow.browserWindow.removeAllListeners("blur");
    }
  } else {
    MainWindow.browserWindow.webContents.send("change-settings", args);
  }
});

let getCurrentWindowIcon = () => {
  const window = windowManager.getActiveWindow();
  let iconBuffer = window.getIcon(32);
  let icon = nativeImage.createFromBuffer(iconBuffer, {
    width: 64,
    height: 64
  });
  return icon.toDataURL();
};

clipboard
  .on("text-changed", async () => {
    let currentText = clipboard.readText();
    let isLink = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/.test(
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
    let base64Icon = getCurrentWindowIcon();
    try {
      let isExist;
      [data.checksum, isExist] = await cardIconDb.getChecksumAndExist(
        base64Icon
      );
      if (!isExist)
        await cardIconDb.create({
          content: base64Icon,
          checksum: data.checksum
        });

      MainWindow.browserWindow.webContents.send("clipboard-text-changed", {
        data: await db.create(data),
        isExist: isExist
      });
    } catch (e) {
      log.error(e);
    }
  })
  .on("image-changed", async () => {
    // const window = windowManager.getActiveWindow();
    let currentIMage = clipboard.readImage();
    let image = {
      table: "historyData",
      copyType: "Image",
      copyTime: new Date(),
      copyContent: currentIMage.toDataURL(),
      otherInfo: currentIMage.getSize()
    };
    try {
      let base64Icon = getCurrentWindowIcon();
      let isExist;
      [image.checksum, isExist] = await cardIconDb.getChecksumAndExist(
        base64Icon
      );
      if (!isExist)
        await cardIconDb.create({
          content: base64Icon,
          checksum: image.checksum
        });

      MainWindow.browserWindow.webContents.send("clipboard-image-changed", {
        data: await db.create(image),
        isExist: isExist
      });
    } catch (e) {
      log.error(e);
    }
  })
  .startWatching();

app
  .on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        let name = await installExtension(VUEJS_DEVTOOLS);
        mainLog.info(`Added Extension:  ${name}`);
      } catch (e) {
        mainLog.error("Vue Devtools failed to install:", e.toString());
      }
    }
    try {
      await db.initData();
      await labelDb.initData();
    } catch (e) {
      mainLog.error("init database fail: ", e.toString());
    }

    try {
      await new MainWindow().createWindow();
      global.settingsWindow = await new SettingsWindow().createWindow();
      if (config.get("trayIcon")) {
        await new AppTray().createTray();
      }
      GlobalShortcut.registerAltAndV();
    } catch (e) {
      mainLog.error("init windows fail: ", e.toString());
    }

    try {
      new AutoUpdater();
    } catch (e) {
      mainLog.error("init auto updater fail: ", e.toString());
    }
    screen.on("display-metrics-changed", async () => {
      if (MainWindow.browserWindow) {
        MainWindow.browserWindow.destroy();
        MainWindow.browserWindow = undefined;
        global.settingsWindow = await new MainWindow().createWindow();
      }
    });

    screen.on("display-removed", () => {
      log.info("[screen]: display-removed");
    });

    screen.on("display-added", () => {
      log.info("[screen]: display-added");
    });
  })
  .on("activate", async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      await new MainWindow().createWindow();
      await new SettingsWindow().createWindow();
    }
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
mainLog.info("configPath: ", config.file());
mainLog.info("loggPath: ", log.transports.file.getFile().path);
