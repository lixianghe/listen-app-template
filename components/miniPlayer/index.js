const app = getApp();
import tool from "../../utils/util";
import btnConfig from "../../utils/pageOtpions/pageOtpions";

Component({
  properties: {
    percent: {
      type: Number,
      default: 0,
    },
    songpic: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    no: {
      type: Number,
      default: 0,
    },
    songInfo: {
      type: Object,
      default: {},
    },
  },
  data: {
    colorStyle: app.sysInfo.colorStyle,
    backgroundColor: app.sysInfo.backgroundColor,
    screen: app.globalData.screen,
    // mini player按钮配置
    miniBtns: [
      {
        name: "pre",
        img: "/images/pre.png",
      },
      {
        name: "toggle",
        img: {
          stopUrl: "/images/stop.png",
          playUrl: "/images/play.png",
        },
      },
      {
        name: "next",
        img: "/images/next.png",
      },
    ],
    // 开发者不传的话默认的按钮
    defaultBtns: [
      {
        name: "toggle",
        img: {
          stopUrl: "/images/stop.png",
          playUrl: "/images/play.png",
        },
      },
    ],
    playing: false,
    hoverflag: false,
    current: null,
    canplay: [],
    mianColor: btnConfig.colorOptions.mainColor,
    percentBar: btnConfig.percentBar,
    existed: false,
  },
  audioManager: null,
  attached: function () {},
  detached: function () {},
  methods: {
    player(e) {
      if (!this.data.songInfo || !this.data.songInfo.title) {
        wx.showToast({ title: "暂无音频", icon: "none" });
        return false;
      }
      const type = e.currentTarget.dataset.name;
      if (type) this[type]();
    },
    // 上一首
    pre() {
      if (app.globalData.songInfo.title) {
        setTimeout(() => {
          this.triggerEvent("current", this.data.currentId);
        }, 300);
      }
      // 设置播放图片名字和时长
      const that = this;
      app.cutplay(that, -1);
    },
    // 下一首
    next() {
      if (app.globalData.songInfo.title) {
        setTimeout(() => {
          this.triggerEvent("current", this.data.currentId);
        }, 300);
      }
      // 设置播放图片名字和时长
      const that = this;
      app.cutplay(that, +1);
    },
    // 暂停
    toggle() {
      tool.toggleplay(this, app);
    },
    // 进入播放详情
    playInfo() {
      if (!this.data.songInfo || !this.data.songInfo.title) {
        // wx.showToast({ title: '暂无音频', icon: 'none' })
        return false;
      }
      let abumInfoName = wx.getStorageSync("abumInfoName");
      wx.navigateTo({
        url: `../playInfo/playInfo?noPlay=true&abumInfoName=${abumInfoName}`,
      });
    },
    // 监听音乐播放的状态
    listenPlaey() {
      const that = this;
      // 每次从缓存中拿到当前歌曲的相关信息，还有播放列表
      if (app.globalData.songInfo && app.globalData.songInfo.title) {
        that.setData({
          songInfo: app.globalData.songInfo,
        });
      }
      // 监听歌曲播放状态，比如进度，时间
      tool.playAlrc(that, app);
    },
    btnstart(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        hoverflag: true,
        current: index,
      });
    },
    btend() {
      setTimeout(() => {
        this.setData({
          hoverflag: false,
          current: null,
        });
      }, 150);
    },
    // 因为1.9.2版本无法触发onshow和onHide所以事件由它父元素触发
    setOnShow() {
      // let that = this
      this.listenPlaey();
      const playing = wx.getStorageSync("playing");
      this.setData({
        playing: playing,
        percent: app.globalData.percent || 0,
      });
      // if (playing) app.playing(null, that)
    },
    setOnHide() {},
  },
});
