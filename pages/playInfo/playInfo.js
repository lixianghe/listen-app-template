
const app = getApp()
import tool from '../../utils/util'
import btnConfig from '../../utils/pageOtpions/pageOtpions'

Page({
  mixins: [require('../../developerHandle/playInfo')],
  data: {
    songInfo: {},
    playing: false,
    drapType: false,
    percent: 0,
    drapPercent: 0,
    playtime: '00:00',
    showList: false,
    currentId: null,
    // 开发者不传默认的按钮
    defaultBtns: [
      {
        name: 'toggle',                                          // 播放/暂停
        img: {
          stopUrl: '/images/stop2.png' ,                         // 播放状态的图标
          playUrl: '/images/play2.png'                           // 暂停状态的图标
        }
      },
    ],
    btnCurrent: null,
    noTransform: '',
    likeType: 'noLike',
    total: 0,
    scrolltop: 0,
    isDrag: '',
    barWidth: 0,
    currentTime: 0,
    mainColor: btnConfig.colorOptions.mainColor,
    percentBar: btnConfig.percentBar,
    showImg: false,
    bigScreen: app.globalData.PIbigScreen,
    abumInfoName: null,
    existed: false,
    mainColor: btnConfig.colorOptions.mainColor,
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen
  },
  // 播放器实例
  audioManager: null,
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
  },
  async onLoad(options) {
    // 根据分辨率设置样式
    this.setStyle()
    // 获取歌曲列表
    const canplay = wx.getStorageSync('allList')
    let abumInfoName = wx.getStorageSync('abumInfoName')
    const songInfo = app.globalData.songInfo
    this.setData({
      songInfo: songInfo,
      canplay: canplay,
      noPlay: options.noPlay || null,
      abumInfoName: options.abumInfoName || null,
      abumInfoId: options.abumInfoId || null
    })
    // 把abumInfoName存在缓存中
    wx.setStorageSync('abumInfoName', options.abumInfoName)
    wx.setStorageSync('abumInfoId', options.abumInfoId)
    if (options.noPlay !== 'true' || abumInfoName !== options.abumInfoName) wx.setStorageSync('nativeList', canplay)
    if (options.noPlay !== 'true') wx.showLoading({ title: '加载中...', mask: true })
  },
  onShow: function () {
    const that = this;
    // 监听歌曲播放状态，比如进度，时间
    tool.playAlrc(that, app);
    that.queryProcessBarWidth()
  },
  onUnload: function () {

  },
  onHide: function () {

  },
  imgOnLoad() {
    this.setData({ showImg: true })
  },
  play() {
    let that = this
    that.setData({
      playtime: app.globalData.playtime || '00:00',
      percent: app.globalData.percent || 0
    })
    app.playing(null, that)
  },
  btnsPlay(e) {
    const type = e.currentTarget.dataset.name
    if (type) this[type]()
  },
  // 上一首
  pre() {
    const that = this
    app.cutplay(that, -1)
  },
  // 下一首
  next() {
    const that = this
    app.cutplay(that, 1)
  },
  // 暂停/播放
  toggle() {
    const that = this
    tool.toggleplay(that, app)
  },
  closeList() {
    this.setData({
      showList: false,
      noTransform: ''
    })
    // 显示的过度动画
    this.animation.translate('-180vh', 0).step()
    this.setData({
      animation: this.animation.export()
    })
  },
  // 在播放列表里面点击播放歌曲
  async playSong(e) {
    const songInfo = e.currentTarget.dataset.song
    app.globalData.songInfo = songInfo
    // 获取歌曲详情
    let params = {mediaId: app.globalData.songInfo.id}
    await this.getMedia(params)
    this.setData({
      songInfo: songInfo,
      currentId: app.globalData.songInfo.id,
      playing: true
      // noTransform: ''
    })
    app.playing(null, this)
  },
  // 开始拖拽
  dragStartHandle(event) {
    console.log('isDrag', this.data.isDrag)
    this.setData({
      isDrag: 'is-drag',
      _offsetLeft: event.changedTouches[0].pageX,
      _posLeft: event.currentTarget.offsetLeft
    })
  },
  // 拖拽中
  touchmove(event) {
    let offsetLeft = event.changedTouches[0].pageX
    let process = (offsetLeft - this.data._offsetLeft + this.data._posLeft) / this.data.barWidth
    if (process < 0) {
        process = 0
    } else if (process > 1) {
        process = 1
    }
    let percent = (process * 100).toFixed(3)
    let currentTime = process * tool.formatToSend(app.globalData.songInfo.dt)
    let playtime = currentTime ? tool.formatduration(currentTime * 1000) : '00:00'
    this.setData({
      percent,
      currentTime,
      playtime
    })
  },
  // 拖拽结束
  dragEndHandle(event) {
    wx.seekBackgroundAudio({
      position: this.data.currentTime
    })
    setTimeout(() => {
      this.setData({isDrag: ''})
    }, 500)
  },
  // 查询processBar宽度
  queryProcessBarWidth() {
    var query = this.createSelectorQuery();
    query.selectAll('.process-bar').boundingClientRect();
    query.exec(res => {
      try {
        this.setData({
          barWidth: res[0][0].width
        })
      } catch (err) {
      }
    })
  },
  // ******按钮点击态处理********/
  btnstart(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      btnCurrent: index

    })
  },
  btend() {
    setTimeout(()=> {
      this.setData({
        btnCurrent: null
      })
    }, 150)
  },
   // ******按钮点击态处理********/
   
  // 根据分辨率判断显示哪种样式
  setStyle() {
    // 判断分辨率的比列
    const windowWidth =  wx.getSystemInfoSync().screenWidth;
    const windowHeight = wx.getSystemInfoSync().screenHeight;
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 0.41) {
      this.setData({
        bigScreen: false,
        leftWith: windowWidth * 0.722 + 'px',
        leftPadding: '0vh 9.8vh 20vh',
        btnsWidth: '140vh',
        imageWidth: windowWidth * 0.17 + 'px'
      })
    } else {
      // 1920*720
      this.setData({
        bigScreen: true,
        leftWith: '184vh',
        leftPadding: '0vh 12.25vh 20vh',
        btnsWidth: '165vh',
        imageWidth: '49vh'
      })
    }
  }
})