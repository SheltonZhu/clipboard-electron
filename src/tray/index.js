import { Menu, Tray } from "electron";
import path from "path";

export default function initTray(app, win) {
  // 用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区
  // 系统托盘右键菜单
  const trayMenuTemplate = [
    {
      label: "⚙设置",
      click: () => {
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
  const iconPath = path.join(__dirname, "../src/assets/logo.png");
  const appTray = new Tray(iconPath);
  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  // 设置托盘悬浮提示
  appTray.setToolTip("Electron Clipboard");
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu);
  //双击事件
  appTray.on("double-click", () => {
    // 显示主程序
    if (!win.isVisible()) win.show();
  });
  return appTray;
}
