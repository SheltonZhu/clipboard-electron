"use strict";
/* global __static */
import { globalShortcut, screen, app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";
import initTray from "@/tray";
import path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  // Create the browser window.
  const display = screen.getPrimaryDisplay().workAreaSize; //1440,2560
  const winWidth = display.width;
  const winHeight = Math.floor(display.height / 3);
  const offsetY = winHeight * 2;
  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: 0,
    y: offsetY,
    frame: false,
    transparent: true,
    // backgroundColor: "#ffffff00",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      experimentalFeatures: true,
      enableRemoteModule: true,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js")
    },
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    hasShadow: true,
    skipTaskbar: true,
    vibrancy: "light", //macos
    // icon: path.join(__dirname, "../src/assets/favicon.ico"),
    icon: path.join(__static, "icon.png"),
    title: "ClipBoard",
    titleBarStyle: "hidden",
    show: false
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify();
  }

  initTray(app, win);

  win.on("close", function(e) {
    e.preventDefault();
    win.hide();
  });

  //为了让画面显示时没有视觉闪烁，
  // win.once("ready-to-show", () => {
  //   win.show();
  // });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  try {
    globalShortcut.register("Alt+V", () => {
      const win =
        BrowserWindow.getAllWindows().length > 0
          ? BrowserWindow.getAllWindows()[0]
          : null;
      if (win && !win.isVisible()) win.show();
      else if (!win) console.error("无窗口可获取。");
    });
    globalShortcut.register("Esc", () => {
      const win =
        BrowserWindow.getAllWindows().length > 0
          ? BrowserWindow.getAllWindows()[0]
          : null;
      if (!win) console.error("无窗口可获取。");
      else win.hide();
    });
  } catch (e) {
    console.error("注册快捷键失败:", e.toString());
  }
  createWindow();
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
