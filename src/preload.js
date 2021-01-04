import { ipcRenderer } from "electron";
import log from "@/main/log";

window.ipcRenderer = ipcRenderer;
window.log = log;
