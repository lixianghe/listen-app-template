import tool from '../../utils/util'
const app = getApp()

Page({
  mixins: [require('../../developerHandle/index')],
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    mainColor: app.globalData.mainColor,
    confirm: '',
    currentTap: 0,
    scrollLeft: 0,
    isFixed: false,
    reactCode: 0,
    abumInfoId: null
  },
  scrollhandle(e) {
    if (e.detail.scrollLeft > 230) {
      this.setData({
        isFixed: true
      })
    } else {
      this.setData({
        isFixed: false
      })
    }
    
  },
  onLoad(options) {
    // 检测网络问题
    tool.getNetWork(this)
    setTimeout(() => {
      wx.checkSession({
        success:(res)=> {
          if(JSON.stringify(wx.getStorageSync('username'))) {
            wx.setTabBarItem({
              index: 2, 
              text: wx.getStorageSync('username'),
            })
          }
        },
        fail: (res) => {
          app.userInfo.token = ''
          app.userInfo.vipStatus = '';
          app.userInfo.expireTime = '';
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('username')
        }
      })
      
    }, 800);
  },
  onShow() {
    this.selectComponent('#miniPlayer').setOnShow()
    tool.showPlayStatus(this)
  },
  onHide() {
    this.selectComponent('#miniPlayer').setOnHide()
  }
})