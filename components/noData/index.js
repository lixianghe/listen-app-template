const app = getApp();

Component({
  data: {
    noNetImg: "../../images/img_wangluoyichang.png",
    noDataImg: "../../images/img_zanwushuju.png",
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    reactCode: 0, // 0正常，1网络异常，2无数据
  },
  properties: {
    reactCode: Number,
  },
  methods: {
    refresh() {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      wx.getNetworkType({
        async success(res) {
          const networkType = res.networkType;
          if (networkType === "none") {
            wx.showToast({
              title: "网络异常，请检查网络",
              icon: "none",
            });
          } else {
            currentPage.onLoad(currentPage.options);
          }
        },
      });
    },
  },
  attached(options) {},
});
