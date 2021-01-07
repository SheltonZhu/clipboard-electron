/* global __static */

import { app, dialog, Menu, Tray } from "electron";
import config from "@/main/config";
import path from "path";

export default class AppTray {
  constructor(mainWin, settingsWin) {
    this.mainWin = mainWin;
    this.settingsWin = settingsWin;
  }

  createTray() {
    if (!this.appTray) {
      // 系统托盘右键菜单
      const contextMenu = Menu.buildFromTemplate(this.createMenu());
      const appIcon = path.join(__static, "icon.png");
      this.appTray = new Tray(appIcon);
      // 设置托盘菜单
      this.appTray.setContextMenu(contextMenu);
      // 设置托盘悬浮提示
      this.appTray.setToolTip("Electron Clipboard");
    }
    this.createListener();
    return this.appTray;
  }

  createListener() {
    this.appTray.on("click", () => {
      this.toggleMainWindow();
    });
  }

  createMenu() {
    return [
      {
        label: "设置",
        click: () => {
          if (!this.settingsWin.isVisible()) this.settingsWin.show();
        }
      },
      {
        type: "separator"
      },
      {
        label: "版本信息",
        click: this.showVersionInfo
      },
      {
        label: "帮助",
        type: "submenu",
        submenu: [
          {
            label: "使用手册",
            click: this.showHelp
          }
        ]
      },
      {
        type: "separator"
      },
      {
        label: "退出",
        click: this.quitApp
      }
    ];
  }

  toggleMainWindow() {
    if (this.mainWin.isVisible()) this.mainWin.hide();
    else this.mainWin.show();
  }

  showVersionInfo() {
    dialog.showMessageBox({
      title: "Electron Clipboard",
      message: "Electron Clipboard",
      detail: config.get("about")
    });
  }

  showHelp() {
    dialog.showMessageBox({
      title: "使用手册",
      message: "使用手册",
      detail: config.get("helpInfo")
    });
  }

  quitApp() {
    app.exit();
  }
}
