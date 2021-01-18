// components/story/story.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    className: { 
      type: String,
      value: false
    },
    datasource: {
      type: Object,
      value: {
        src: '',
        title: '',
        isVip: false
      }
    },
    likePic:{
      type: Array,
      value: []
    },
    countpic:{
      type: String,
      value: ''
    },
    shape: {
      type: String,
      value: 'square'
    },
    showPlay: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // // 系统配色
    // colorStyle: app.sysInfo.colorStyle,
    // // 系统背景色
    // backgroundColor: app.sysInfo.backgroundColor
    mainColor: app.globalData.mainColor,
    src: [],
    flag: 0,
    width: '',
    height: '',
    // showPlay: false,
    datasourceCount: '',
    playpic: '/images/playing.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    likeOne(e) {
      let flag = !this.data.flag
      let num = Number(flag)
      this.setData({
        src: this.data.likePic[num],
        flag: flag
      })
      let typeid = e.currentTarget.dataset.typeid
      let contentType = e.currentTarget.dataset.contenttype
      this.triggerEvent('clickHadle', { typeid: typeid, contentType: contentType, flag: flag});
    },
    //加载图片失败
    loadImgError: function (res) {
      this.setData({
        'item.coverUrl': app.sysInfo.defaultImg
      })
    },
    showPlay () {
      this.setData({
        showPlay: true
      })
    },
    clearPlay () {
      console.log('falsefalsefalse')
      // 清空上一首播放态
      let playingId = wx.getStorageSync('abumInfoId')
      this.story = this.selectComponent(`#story${playingId}`)
      if (this.story) {
        this.setData({
          showPlay: false
        })
      }
    },
    formW (num) {
      let b = num.toString().split('').reverse()
      let res = b.slice(4, b.length).reverse().join('')+'万'
      return res
    },
    aa() {

    }
  },
  
  attached: function () {
    if(this.data.likePic && this.data.likePic.length > 1) {
      this.setData({
        src: this.data.likePic[this.data.flag]
      })
    }

    let that = this
    this.setData({
      datasourceCount: (that.data.datasource.count > 10000) ? that.formW(that.data.datasource.count) : that.data.datasource.count
    })

    // 封面形状
    switch (this.data.shape) {
      case 'square':
        
        this.setData({
          width: 41.8,
          height: 41.8 
        })
        break;
      case 'rect':
        this.setData({
          width: 36.77,
          height: 43.55
        })
        break;
      case 'rectBig':
        this.setData({
          width: 41.2,
          height: 53.46
        })
        break;
      default:
        break;
    }
  }
})
