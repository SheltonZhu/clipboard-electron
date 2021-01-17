const pkg = require("./package.json");
const env = process.env.NODE_ENV === "development" ? "test" : "";
module.exports = {
  pages: {
    settings: {
      entry: "src/renderer/settings.js",
      template: "public/index.html",
      title: "设置"
    },
    main: {
      entry: "src/renderer/main.js",
      template: "public/index.html",
      title: "剪贴板"
    }
  },
  pluginOptions: {
    electronBuilder: {
      externals: ["node-window-manager"],
      nodeModulesPath: [
        "../../node_modules",
        "./node_modules",
        "./build/Release"
      ],
      nodeIntegration: true,
      // outputDir: 'electron-builder-output-dir'  // Changing the Output Directory
      preload: "src/preload.js",
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        publish: ["github"],
        // asar: false, // 是否使用 asar 壓縮檔案
        // appId: "myappid.id" + env, // 認證的 appId
        productName: pkg.productName + env,
        // artifactName: '${name}.${ext}', // 檔案名稱樣板，有 ESLint 記得關掉
        copyright: "Copyright © 2021 SheltonZhu",
        win: {
          legalTrademarks: "clipboard-electron", // 商标
          icon: "build/icons/icon.ico",
          signingHashAlgorithms: ["sha1", "sha256"],
          target: [
            {
              target: "nsis", // 檔案類型
              arch: [
                "x64"
                // "ia32"
              ] // 檔案位元，越多類型檔案越大
            }
          ]
        },
        dmg: {
          icon: "build/icons/icon.icns"
        },
        linux: {
          icon: "build/icons/icon.png"
        },
        mac: {
          icon: "build/icons/icon.icns"
        },
        nsis: {
          artifactName: "${productName}-Setup-${version}.${ext}",
          oneClick: false, // 一键安装
          installerIcon: "build/icons/icon.ico",
          uninstallerIcon: "build/icons/icon.ico",
          installerHeaderIcon: "build/icons/icon.ico",
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          installerLanguages: ["zh_CN", "en_US"]
        }
      }
    }
  }
};
