import initMainWindow from "./main";
import settings from "./settings";
import { BrowserWindow } from "electron";

export default class WindowManager {
  constructor() {}

  initSettingsWindow() {
    return settings();
  }

  initMainWindow() {
    return initMainWindow();
  }

  hasWindows() {
    return BrowserWindow.getAllWindows().length !== 0;
  }

  setMainWindow(win) {
    WindowManager.mainWindow = win;
  }

  get mainWindowSafe() {
    let hasWindows = this.hasWindows();
    if (hasWindows && WindowManager.mainWindow) return WindowManager.mainWindow;
    else if (hasWindows) return BrowserWindow.getAllWindows()[0];
    else return null;
  }
}
