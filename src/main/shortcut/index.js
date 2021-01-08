import { globalShortcut } from "electron";
import MainWindow from "@/main/windows/main";

export default class GlobalShortcut {
  static registerAltAndV() {
    try {
      globalShortcut.register("Alt+V", () => {
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
}
