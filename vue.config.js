const env = process.env.NODE_ENV === "development" ? "test" : "";
module.exports = {
  configureWebpack: {
    // Webpack configuration applied to web builds and the electron renderer process
  },
  pluginOptions: {
    electronBuilder: {
      // chainWebpackMainProcess: (config) => {
      //   Chain webpack config for electron main process only
      // },
      // chainWebpackRendererProcess: (config) => {
      // Chain webpack config for electron renderer process only (won't be applied to web builds)
      // },
      nodeIntegration: true,
      // outputDir: 'electron-builder-output-dir'  // Changing the Output Directory
      preload: "src/preload.js",
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        publish: ["github"],
        // publish: [
        //   {
        //     provider: 'generic',
        //     url: ''
        //   }
        // ],
        // asar: false, // 是否使用 asar 壓縮檔案
        appId: "your.id" + env, // 認證的 appId
        productName: "productName" + env, // 專案名稱
        // artifactName: '${name}.${ext}', // 檔案名稱樣板，有 ESLint 記得關掉
        copyright: "Copyright©ares", // 版權
        // Windows 相關設定
        win: {
          legalTrademarks: "legalTrademarks", // 商標
          icon: "public/icon.ico", // 安裝檔圖示
          target: [
            {
              target: "nsis", // 檔案類型
              arch: ["x64", "ia32"] // 檔案位元，越多類型檔案越大
            }
          ]
        },
        // DMG 相關設定
        dmg: {
          icon: "public/icon.icns" // 安裝檔圖示
        },
        // Linux 相關設定
        linux: {
          icon: "public/icon.png" // 安裝檔圖示
        },
        // macOS 相關設定
        mac: {
          icon: "public/icon.icns" // 安裝檔圖示
        },
        nsis: {
          oneClick: false, // 是否一鍵安裝
          perMachine: true, // 是否為每一台機器安裝
          installerIcon: "public/icon.ico", // 安裝圖示
          uninstallerIcon: "public/icon.ico", // 卸載圖示
          installerHeaderIcon: "public/icon.ico", // 安裝頂部圖示
          allowToChangeInstallationDirectory: true, // 是否可更改安裝目錄
          createDesktopShortcut: true, // 是否建立桌面捷徑
          createStartMenuShortcut: true // 是否建立開始捷徑
        }
      }
    }
  }
};
