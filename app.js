import tool from "./utils/util";
import btnConfig from "./utils/pageOtpions/pageOtpions";
import { getMedia } from "./developerHandle/playInfo";
require("./utils/minixs");

App({
  globalData: {
    appName: "kaishustory",
    // 屏幕类型
    screen: "",
    mainColor: btnConfig.colorOptions.mainColor,
    indexData: [], // 静态首页数据
    latelyListenId: [], // 静态记录播放id
    abumInfoData: [],
    playing: false,
    percent: 0,
    currentPosition: 0,
    PIbigScreen: null,
  },
  // 小程序颜色主题
  sysInfo: {
    colorStyle: "dark",
    backgroundColor: "#101010",
    defaultBgColor: "#151515",
  },
  // 日志文本
  logText: "",
  audioManager: null,
  onLaunch: function () {
    // 获取小程序颜色主题
    this.getTheme();
    // 判断playInfo页面样式
    this.setStyle();
    this.audioManager = wx.getBackgroundAudioManager();
    // 判断横竖屏
    if (
      wx.getSystemInfoSync().windowWidth > wx.getSystemInfoSync().windowHeight
    ) {
      this.globalData.screen = "h";
    } else {
      this.globalData.screen = "v";
    }
    // 关于音乐播放的
    var that = this;
    //播放列表中下一首
    wx.onBackgroundAudioStop(function () {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      that.cutplay(currentPage, 1);
    });
    //监听音乐暂停，保存播放进度广播暂停状态
    wx.onBackgroundAudioPause(function () {
      that.globalData.playing = false;
      wx.getBackgroundAudioPlayerState({
        complete: function (res) {
          that.globalData.currentPosition = res.currentPosition
            ? res.currentPosition
            : 0;
        },
      });
    });
    wx.setStorageSync("playing", false);
    // 测试getPlayInfoSync
    if (wx.canIUse("getPlayInfoSync")) {
      let res = wx.getPlayInfoSync();
      let playing = res.playState.status == 1 ? true : false;
      wx.setStorageSync("playing", playing);
    }
  },
  cutplay: async function (that, type) {
    wx.showLoading({
      title: "加载中",
    });
    that.setData({ percent: 0 });
    // 判断循环模式
    let allList = wx.getStorageSync("nativeList");
    // 当前歌曲的索引
    let no = allList.findIndex(
      (n) => Number(n.id) === Number(this.globalData.songInfo.id)
    );
    let index = this.setIndex(type, no, allList);
    //歌曲切换 停止当前音乐
    this.globalData.playing = false;
    let song = allList[index] || allList[0];
    wx.pauseBackgroundAudio();
    that.setData({
      currentId: Number(song.id),
    });
    // 控制专辑详情的播放gif
    let pages = getCurrentPages();
    let abum = pages.filter((n) => n.route == "pages/abumInfo/abumInfo")[0];
    if (abum) abum.setData({ currentId: Number(song.id) });
    // 获取歌曲的url
    let params = {
      mediaId: song.id,
    };
    await getMedia(params, that);
    this.playing(null, that);
  },
  // 根据循环模式设置切歌的index,cutFlag为true时说明是自然切歌
  setIndex(type, no, list) {
    let index;
    if (type === 1) {
      index = no + 1 > list.length - 1 ? 0 : no + 1;
    } else {
      index = no - 1 < 0 ? list.length - 1 : no - 1;
    }
    return index;
  },
  // 暂停音乐
  stopmusic: function () {
    wx.pauseBackgroundAudio();
  },
  // 根据歌曲url播放歌曲
  playing: function (seek, that) {
    const songInfo = wx.getStorageSync("songInfo");
    if (!songInfo || !songInfo.src) return;
    this.carHandle(songInfo, seek);
    tool.initAudioManager(this, that, songInfo);
  },
  // 车载情况下的播放
  carHandle(songInfo, seek) {
    this.audioManager.src = songInfo.src;
    this.audioManager.title = songInfo.title;
    this.audioManager.coverImgUrl = songInfo.coverImgUrl;
    if (seek != undefined && typeof seek === "number") {
      wx.seekBackgroundAudio({
        position: seek,
      });
    }
  },
  // 根据分辨率判断显示哪种样式
  setStyle() {
    // 判断分辨率的比列
    const windowWidth = wx.getSystemInfoSync().screenWidth;
    const windowHeight = wx.getSystemInfoSync().screenHeight;
    // 如果是小于1/2的情况
    if (windowHeight / windowWidth >= 0.41) {
      this.globalData.PIbigScreen = false;
    } else {
      // 1920*720
      this.globalData.PIbigScreen = true;
    }
  },
  // 获取颜色主题
  getTheme: function () {
    if (wx.canIUse("getColorStyle")) {
      wx.getColorStyle({
        success: (res) => {
          this.sysInfo.colorStyle = res.colorStyle;
          this.sysInfo.backgroundColor = res.backgroundColor;
          this.globalData.themeLoaded = true;
        },
        fail: () => {
          this.sysInfo.backgroundColor = this.sysInfo.defaultBgColor;
          this.globalData.themeLoaded = true;
        },
      });
    } else {
      this.sysInfo.backgroundColor = this.sysInfo.defaultBgColor;
      this.globalData.themeLoaded = true;
    }
    if (wx.canIUse("onColorStyleChange")) {
      wx.onColorStyleChange((res) => {
        this.sysInfo.colorStyle = res.colorStyle;
        this.sysInfo.backgroundColor = res.backgroundColor;
        wx.setTabBarStyle({
          color: res.colorStyle == "dark" ? "#FFFFFF" : "#c4c4c4",
        });
      });
    }
  },
  // 设置页面配色
  setTheme(page) {
    if (this.globalData.themeLoaded) {
      page.setData({
        colorStyle: this.sysInfo.colorStyle,
        backgroundColor: this.sysInfo.backgroundColor,
      });
    } else {
      this.watch(page, "themeLoaded", (val) => {
        if (val) {
          page.setData({
            colorStyle: this.sysInfo.colorStyle,
            backgroundColor: this.sysInfo.backgroundColor,
          });
        }
      });
    }
    if (wx.canIUse("onColorStyleChange")) {
      wx.onColorStyleChange((res) => {
        this.sysInfo.colorStyle = res.colorStyle;
        this.sysInfo.backgroundColor = res.backgroundColor;
        page.setData({
          colorStyle: this.sysInfo.colorStyle,
          backgroundColor: this.sysInfo.backgroundColor,
        });
      });
    }
  },
  // 记录日志
  log(...text) {
    for (let e of text) {
      if (typeof e == "object") {
        try {
          if (e === null) {
            this.logText += "null";
          } else if (e.stack) {
            this.logText += e.stack;
          } else {
            this.logText += JSON.stringify(e);
          }
        } catch (err) {
          this.logText += err.stack;
        }
      } else {
        this.logText += e;
      }
      this.logText += "\n";
    }
    this.logText += "#############\n";
  },
  version: "1.3.0",
  // log - 日志文本
  logText: "",
  // log - 日志开关，1 => 开启，0 => 关闭
  openLog: 1,
});
