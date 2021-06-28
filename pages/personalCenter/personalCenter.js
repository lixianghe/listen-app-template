const tool = require("../../utils/util");

const app = getApp();
import btnConfig from "../../utils/pageOtpions/pageOtpions";
Page({
  mixins: [require("../../developerHandle/personalCenter")],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    avatar: "",
    userName: "",
    withCredentials: true,
    // userInfo: null,
    debugLog: "",
    songInfo: {},
    mainColor: btnConfig.colorOptions.mainColor,
    reactCode: 0,
  },

  // 测试用清除最近收听数据
  clearStorage() {
    wx.setStorageSync("indexData", null);
  },
  onLoad(options) {
    // 检测网络问题
    tool.getNetWork(this);
  },
  onShow() {
    this.selectComponent("#miniPlayer").setOnShow();
  },
  onHide() {
    this.selectComponent("#miniPlayer").setOnHide();
  },
});
