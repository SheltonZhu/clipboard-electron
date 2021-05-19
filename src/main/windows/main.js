/* global __static */

import { BrowserWindow, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import path from "path";
import config from "@/main/config";
import GlobalShortcut from "@/main/shortcut";
import os from "os";
const isDevelopment = config.get("isDevelopment");

export default class MainWindow {
  constructor() {
    this.SERVER_URL = process.env.WEBPACK_DEV_SERVER_URL;
    MainWindow.browserWindow = undefined;
  }

  async createWindow() {
    if (!MainWindow.browserWindow) {
      const display = screen.getPrimaryDisplay().workAreaSize;
      let browserOptions = {
        webPreferences: {
          experimentalFeatures: true,
          enableRemoteModule: true,
          // webSecurity: true,
          nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
          preload: path.join(__dirname, "preload.js")
        },
        width: display.width,
        height: 472,
        x: 0,
        y: os.platform() === "linux" ? display.height : display.height - 472,
        backgroundColor: "#00000000",
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        movable: false,
        fullscreenable: false,
        minimizable: false,
        closable: false,
        autoHideMenuBar: true,
        hasShadow: true,
        skipTaskbar: true,
        vibrancy: "light", //macos
        icon: path.join(__static, "icon.png"),
        title: "ClipBoard",
        titleBarStyle: "hidden",
        show: false
      };
      this.browserWindow = new BrowserWindow(browserOptions);

      if (this.SERVER_URL) {
        // Load the url of the dev server if in development mode
        await this.browserWindow.loadURL(
          process.env.WEBPACK_DEV_SERVER_URL + "main"
        );
        if (!process.env.IS_TEST) this.browserWindow.webContents.openDevTools();
      } else {
        createProtocol("app");
        //   Load the index.html when not in development
        await this.browserWindow.loadURL("app://./main.html");
      }
      this.createListener();
      MainWindow.browserWindow = this.browserWindow;
    }
    return MainWindow.browserWindow;
  }

  createListener() {
    this.browserWindow.on("close", e => {
      e.preventDefault();
      this.browserWindow.hide();
    });
    this.browserWindow.on("show", GlobalShortcut.registerEsc);
    this.browserWindow.on("hide", () => {
      if (global.activeWindow && process.platform !== "linux") {
        global.activeWindow.bringToTop();
        global.activeWindow = undefined;
      }
      GlobalShortcut.unregisterEsc();
      GlobalShortcut.unregisterAltAnd219();
      GlobalShortcut.unregisterAltAnd221();
      GlobalShortcut.unregisterAltAndS();
    });
    if (config.get("hideWhenBlur"))
      this.browserWindow.on("blur", this.browserWindow.hide);
    if (isDevelopment) {
      this.browserWindow.once("ready-to-show", this.browserWindow.show);
    }
  }
}
