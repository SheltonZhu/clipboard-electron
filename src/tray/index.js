/* global __static */

import { Menu, Tray, dialog } from "electron";
import path from "path";
import pkg from "../../package.json";

export default function initTray(app, win) {
  // 系统托盘右键菜单
  const trayMenuTemplate = [
    {
      label: "其他",
      type: "submenu",
      submenu: [
        {
          label: "其他1",
          type: "radio"
        },
        {
          label: "其他2",
          type: "radio"
        }
      ]
    },
    {
      label: "©版本信息",
      click: () => {
        dialog.showMessageBox({
          title: "Electron Clipboard",
          message: "Electron Clipboard",
          detail: `Version: ${pkg.version}\nAuthor: ${pkg.author}\nGithub:${pkg.github}\nDescription:${pkg.description}`
        });
      }
    },
    {
      label: "📓使用手册",
      click: () => {
        dialog.showMessageBox({
          title: "使用手册",
          message: "使用手册",
          detail:
            "【Esc】: 隐藏剪切板\n【Alt+V】: 呼出剪贴板\n【Enter】: 粘贴选中\n【→】: 选中下一个\n【←】: 选中上一个"
        });
      }
    },
    {
      label: "⚙设置",
      click: () => {
        // if (settingWindow === null) {
        //   createSettingWindow()
        //   settingWindow.show()
        // } else {
        //   settingWindow.show()
        //   settingWindow.focus()
        // }
        console.log("打开设置");
      }
    },
    {
      // 系统托盘图标目录
      label: "💨退出",
      click: () => {
        // 关闭托盘显示
        appTray.destroy();
        app.exit();
      }
    }
  ];
  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  // 用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区
  const iconPath = path.join(__static, "icon.png");

  const appTray = new Tray(iconPath);
  // 设置托盘悬浮提示
  appTray.setToolTip("Electron Clipboard");
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu);
  appTray.on("click", () => {
    if (!win.isVisible()) win.show();
    else win.hide();
  });
  // return appTray;
}
