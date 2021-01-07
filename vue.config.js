const env = process.env.NODE_ENV === "development" ? "test" : "";
module.exports = {
  pages: {
    settings: {
      entry: "src/renderer/settings.js",
      template: "public/index.html"
    },
    main: {
      entry: "src/renderer/main.js",
      template: "public/index.html"
    }
  },
  pluginOptions: {
    electronBuilder: {
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
        // appId: "myappid.id" + env, // 認證的 appId
        productName: "clipboard" + env,
        // artifactName: '${name}.${ext}', // 檔案名稱樣板，有 ESLint 記得關掉
        copyright: "Copyright©SheltonZhu",
        win: {
          legalTrademarks: "clipboard-electron", // 商标
          icon: "build/icons/icon.ico",
          target: [
            {
              target: "nsis", // 檔案類型
              arch: ["x64", "ia32"] // 檔案位元，越多類型檔案越大
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
          oneClick: false, // 一键安装
          perMachine: true, // 是否為每一台機器安裝
          installerIcon: "build/icons/icon.ico",
          uninstallerIcon: "build/icons/icon.ico",
          installerHeaderIcon: "build/icons/icon.ico",
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true
        }
      }
    }
  }
};
