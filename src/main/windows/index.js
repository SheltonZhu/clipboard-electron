import SettingsWindow from "@/main/windows/settings";
import MainWindow from "@/main/windows/main";

export default class WindowManager {
  async createWindows() {
    this.settingsWindow = await new SettingsWindow().createWindow();
    this.mainWindow = await new MainWindow().createWindow();
    return [this.mainWindow, this.settingsWindow];
  }

  getMainWindow() {
    return this.mainWindow;
  }

  getSettingsWindow() {
    return this.settingsWindow;
  }
}
