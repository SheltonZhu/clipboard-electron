/* global __static */
import { app, Menu, Tray, dialog } from "electron";
import path from "path";
import windowManager from "@/main/windows";
import config from "electron-cfg";

export default () => {
  let mainWin = new windowManager().mainWindowSafe;

  // 系统托盘右键菜单
  const trayMenuTemplate = [
    {
      label: "设置",
      click: () => {
        // if (settingWindow === null) {
        //   createSettingWindow()
        //   settingWindow.show()
        // } else {
        //   settingWindow.show()
        //   settingWindow.focus()
        // }
        // console.log("打开设置");
      }
    },
    {
      type: "separator"
    },
    {
      label: "版本信息",
      click: () => {
        dialog.showMessageBox({
          title: "Electron Clipboard",
          message: "Electron Clipboard",
          detail: config.get("about")
        });
      }
    },
    {
      label: "帮助",
      type: "submenu",
      submenu: [
        {
          label: "使用手册",
          click: () => {
            dialog.showMessageBox({
              title: "使用手册",
              message: "使用手册",
              detail: config.get("helpInfo")
            });
          }
        }
      ]
    },
    {
      type: "separator"
    },
    {
      // 系统托盘图标目录
      label: "退出",
      click: () => {
        // 关闭托盘显示
        app.exit();
      }
    }
  ];
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  const appIcon = path.join(__static, "icon.png");
  const appTray = new Tray(appIcon);
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu);
  // 设置托盘悬浮提示
  appTray.setToolTip("Electron Clipboard");
  appTray.on("click", () => {
    if (mainWin.isVisible()) mainWin.hide();
    else mainWin.show();
  });
  return appTray;
};
