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
    that.setData({ 
      playing: false 
    })
    app.stopmusic();
  } else {
    that.setData({
      playing: true
    })
    app.playing(null, that)
    wx.seekBackgroundAudio({
      position: app.globalData.currentPosition
    })
  }
}

// 向统一播放器传值
function initAudioManager(app, that, songInfo) {
  const nativeList = wx.getStorageSync('nativeList') || []
  const playList = nativeList.map(item => {
    return {
      title: item.title, //音频标题
      singer: item.singer, //歌手名
      coverImgUrl: item.coverImgUrl, //封面图 URL
      dataUrl: item.src, // 音频的数据源
      options: JSON.stringify(item) //自定义字段
    }
  })
  console.log(playList);
  app.audioManager.playInfo = {
    playList,
    context: JSON.stringify(songInfo)
  };
  EventListener(app, that)
}

function EventListener(app, that){
  //播放事件
  app.audioManager.onPlay(() => {
    wx.hideLoading()
    wx.setStorageSync('playing', true)
    that.setData({
      playing: true
    })
    let pages = getCurrentPages()
    let cureentPage = pages[pages.length - 1]
    let minibar = cureentPage.selectComponent('#miniPlayer')
    if (minibar) minibar.isLiked()
    that.triggerEvent('setPlaying', true)
  })
  //暂停事件
  app.audioManager.onPause(() => {
    wx.setStorageSync('playing', false)
    that.setData({
      playing: false
    })
    that.triggerEvent('setPlaying', false)
  })
  //上一首事件
  app.audioManager.onPrev(() => {
    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (miniPlayer) {
      miniPlayer.pre(true)
    } else {
      pages[pages.length - 1].pre(true)
    }

  })
  //下一首事件
  app.audioManager.onNext(() => {
    const pages = getCurrentPages()
    let miniPlayer = pages[pages.length - 1].selectComponent('#miniPlayer')
    if (miniPlayer) {
      miniPlayer.next(true)
    } else {
      pages[pages.length - 1].next(true)
    }
  })
  //停止事件
  app.audioManager.onStop(() => {
   let time = app.audioManager.currentTime / app.audioManager.duration * 100;
    that.setData({
      percent: time
    })
    app.globalData.percent = time
    wx.hideLoading()
  })
  //播放错误事件
  app.audioManager.onError(() => {
    console.log('触发播放错误事件');
  })
  //播放完成事件
  app.audioManager.onEnded(() => {
    console.log('触发播放完成事件');
  })
}

// 控制封面上播放状态的显示隐藏
function showPlayStatus(that) {
  let storyId = wx.getStorageSync('abumInfoId')
  that.setData({
    abumInfoId: storyId
  })
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
  getNetWork: getNetWork,
  showPlayStatus: showPlayStatus
}
