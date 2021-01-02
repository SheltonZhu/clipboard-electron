/* global __static */
import { app, Menu, Tray, dialog } from "electron";
import path from "path";
import windowManager from "../windows";
import pkg from "../../../package.json";

export default () => {
  let mainWin = new windowManager().mainWindowSafe;

  // 系统托盘右键菜单
  const trayMenuTemplate = [
    {
      label: "其他",
      type: "submenu",
      submenu: [
        {
          label: "其他1",
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
