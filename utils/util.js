function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//转换播放时间
function formatduration(duration) {
  duration = new Date(duration);
  return formatNumber(duration.getMinutes()) + ":" + formatNumber(duration.getSeconds());
}

// 时间转秒
function formatToSend(dt) {
  const dtArray = dt.split(':')
  const seconds = Number(dtArray[0]) * 60 + Number(dtArray[1])
  return seconds
}

//音乐播放监听
function playAlrc(that, app) {
  var time = 0, playtime = 0;
  app.audioManager.onTimeUpdate((res) => {
    time = app.audioManager.currentTime / app.audioManager.duration * 100
    playtime = app.audioManager.currentTime
    app.globalData.percent = time
    app.globalData.currentPosition = app.audioManager.currentTime
    app.globalData.playtime = playtime ? formatduration(playtime * 1000) : '00:00'
    if (!that.data.isDrag) {
      that.setData({
        playtime: playtime ? formatduration(playtime * 1000) : '00:00',
        percent: time || 0
      })
    }
  })
}


function toggleplay(that, app) {
  if (that.data.playing) {
    console.log("暂停播放")
    that.setData({ 
      playing: false 
    })
    app.stopmusic();
  } else {
    console.log("继续播放")
    that.setData({
      playing: true
    })
    app.playing(null, that)
    wx.seekBackgroundAudio({
      position: app.globalData.currentPosition
    })
  }
}


// 初始化 BackgroundAudioManager
function initAudioManager(app, that, songInfo) {
  let list = wx.getStorageSync('nativeList')
  that.audioManager = wx.getBackgroundAudioManager()
  console.log('app.globalData.songInfo-----------------------------------' + JSON.stringify(app.globalData.songInfo))
  that.audioManager.playInfo = {
    playList: list,
    playState: {
      // curIndex: app.globalData.songIndex,                                      //当前播放列表索引
      // duration: app.globalData.songInfo.trial ? app.globalData.songInfo.trialDuration : app.globalData.songInfo.duration,                                  //总时长
      // currentPosition: app.globalData.currentPosition,             //当前播放时间
      // status: true,                                                   //当前播放状态 0暂停状态 1播放状态 2没有音乐播放
    },
    context: songInfo
  };
  EventListener(that)
}

// 从面板切到小程序的赋值
function panelSetInfo(app, that) {
  // 测试getPlayInfoSync
  if (wx.canIUse('getPlayInfoSync')) {
    let res = wx.getPlayInfoSync()
    app.log(JSON.stringify(res.context))
    let panelSong = JSON.parse(res.context)
    if (panelSong.src) {
      app.globalData.songInfo = panelSong
      wx.setStorageSync('songInfo', panelSong)
      that.setData({
        songInfo: panelSong,
        showModal: false,
        currentId: panelSong.id,
        abumInfoName: panelSong.abumInfoName
      })
    }
    let playing = res.playState.status == 1 ? true : false
    wx.setStorageSync('playing', playing)
  }
}

// 监听播放，上一首，下一首
function EventListener(that){
  //播放事件
  that.audioManager.onPlay(() => {
    console.log('--------------onPlay----------------')
    wx.hideLoading()
    that.setData({ playing: true });
    wx.setStorageSync('playing', true)
  })
  //暂停事件
  that.audioManager.onPause(() => {
    console.log('触发播放暂停事件');
    that.setData({ playing: false });
    wx.setStorageSync('playing', false)
  })
  //上一首事件
  that.audioManager.onPrev(() => {
    console.log('触发上一首事件');
    that.pre()
  })
  //下一首事件
  that.audioManager.onNext(() => {
    console.log('触发onNext事件');
    that.next();
  })
  //停止事件
  that.audioManager.onStop(() => {
    console.log('触发停止事件');
    that.setData({ playing: false });
    wx.setStorageSync('playing', false)
  })
  //播放错误事件
  that.audioManager.onError(() => {
    console.log('触发播放错误事件');
    that.setData({ playing: false });
    wx.setStorageSync('playing', false)
  })
  //播放完成事件
  that.audioManager.onEnded(() => {
    console.log('触发播放完成事件');
  })
}

// 函数节流
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 100;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

// 函数防抖
function debounce(fn, interval = 300) {
  let canRun = true;
  return function () {
      if (!canRun) return;
      canRun = false;
      setTimeout(() => {
          fn.apply(this, arguments);
          canRun = true;
      }, interval);
  };
}

// 获取网络信息，给出相应操作
function getNetWork(that) {
  // 监听网络状态
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  wx.onNetworkStatusChange(res => {
    const networkType = res.isConnected
    if (!networkType) {
      that.setData({reactCode: 1})
      wx.hideLoading()
    } else {
      that.setData({reactCode: 0})
      currentPage.onLoad(currentPage.options)
    }
  })
}

module.exports = {
  formatToSend: formatToSend,
  formatduration: formatduration,
  playAlrc: playAlrc,
  toggleplay: toggleplay,
  initAudioManager: initAudioManager,
  EventListener: EventListener,
  throttle: throttle,
  debounce: debounce,
  panelSetInfo: panelSetInfo,
  getNetWork: getNetWork
}
