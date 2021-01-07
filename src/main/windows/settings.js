/* global __static */

import { BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import config from "@/main/config";
import path from "path";

const isDevelopment = config.get("isDevelopment");

export default class SettingsWindow {
  constructor() {
    this.SERVER_URL = process.env.WEBPACK_DEV_SERVER_URL;
  }
  async createWindow() {
    if (!this.browserWindow) {
      let browserOptions = {
        webPreferences: {
          experimentalFeatures: true,
          enableRemoteModule: true,
          nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
          preload: path.join(__dirname, "preload.js")
        },
        width: 800,
        height: 600,
        // backgroundColor: "#00000000",
        // transparent: true,
        // frame: false,
        // minimizable: false,
        // closable: false,
        autoHideMenuBar: true,
        hasShadow: true,
        skipTaskbar: true,
        vibrancy: "light", //macos
        icon: path.join(__static, "icon.png"),
        title: "Settings",
        titleBarStyle: "hidden",
        show: false
      };

      this.browserWindow = new BrowserWindow(browserOptions);

      if (this.SERVER_URL) {
        // Load the url of the dev server if in development mode
        await this.browserWindow.loadURL(this.SERVER_URL + "settings");
        if (!process.env.IS_TEST) this.browserWindow.webContents.openDevTools();
      } else {
        createProtocol("app");
        await this.browserWindow.loadURL("app://./settings.html");
      }
      this.createListener();
    }

    return this.browserWindow;
  }

  createListener() {
    this.browserWindow.on("close", e => {
      e.preventDefault();
      this.browserWindow.hide();
    });

    if (isDevelopment) {
      //为了让画面显示时没有视觉闪烁，
      this.browserWindow.once("ready-to-show", () => {
        // win.show();
      });
    }
  }
}
