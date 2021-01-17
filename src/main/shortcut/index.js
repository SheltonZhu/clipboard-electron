import { globalShortcut } from "electron";
import MainWindow from "@/main/windows/main";
import { windowManager } from "node-window-manager";

export default class GlobalShortcut {
  static registerAltAndV() {
    try {
      globalShortcut.register("Alt+V", () => {
        global.activeWindow = windowManager.getActiveWindow();
        if (!MainWindow.browserWindow.isVisible())
          MainWindow.browserWindow.show();
      });
    } catch (e) {
      console.error("注册快捷键失败:", e.toString());
    }
  }

  static registerEsc() {
    globalShortcut.register("Esc", () => {
      MainWindow.browserWindow.hide();
    });
  }

  static unregisterEsc() {
    globalShortcut.unregister("Esc");
  }

  static unregisterAltAnd219() {
    globalShortcut.unregister("Alt+[");
  }

  static unregisterAltAnd221() {
    globalShortcut.unregister("Alt+]");
  }

  static unregisterAltAndS() {
    globalShortcut.unregister("Alt+S");
  }
}
