import { globalShortcut } from "electron";

export default class GlobalShortcut {
  constructor(mainWin) {
    this.mainWin = mainWin;
  }

  createShortCut() {
    try {
      globalShortcut.register("Alt+V", () => {
        if (!this.mainWin.isVisible()) this.mainWin.show();
      });
    } catch (e) {
      console.error("注册快捷键失败:", e.toString());
    }
  }
}
