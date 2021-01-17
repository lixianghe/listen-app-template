import tool from '../../utils/util'
const app = getApp()
Page({
  mixins: [require('../../developerHandle/latelyListen')],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    info: '',
    currentTap: 0,
    scrollLeft: 0,
    
    mainColor: app.globalData.mainColor,
    reactCode: 0
  },
  screen: app.globalData.screen,
 
  onLoad(options) {
    // 检测网络问题
    tool.getNetWork(this)
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    tool.showPlayStatus(this)
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})