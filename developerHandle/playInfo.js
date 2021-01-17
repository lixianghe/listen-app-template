/**
 * @name: playInfo
 * 开发者编写的播放中,通过歌曲id获取歌曲的uel相关信息，id在onLoad的options.id取
 * 这里开发者需要：
 * 1、通过歌曲id获取歌曲详情，由于模板内的字段名称可能和后台提供不一样，在获取歌曲详情后重新给模板内的字段赋值：如下
 *  songInfo.src = data.mediaUrl                          // 音频地址
 *  songInfo.title = data.mediaName                       // 音频名称
 *  songInfo.id = params.mediaId                          // 音频Id
 *  songInfo.dt = data.timeText                           // 音频时常
 *  songInfo.coverImgUrl = data.coverUrl                  // 音频封面
 * 2、重新赋值后setData给songInfo，并且存在Storage缓存中
 * 3、赋值后执行this.play()来播放歌曲
 * 4、其他模板外的功能开发者在这个文件自行开发
 */
const app = getApp()
import { mediaPlay, mediaFavoriteAdd, mediaFavoriteCancel, isFavorite, saveHistory } from '../utils/httpOpt/api'
const { showData } = require('../utils/httpOpt/localData')

module.exports = {
  data: {
    // 播放详情页面按钮配置
    playInfoBtns: [
      {
        name: 'pre',                                             
        img: '/images/pre2.png',                                 
      },
      {
        name: 'toggle',                                          
        img: {
          stopUrl: '/images/stop2.png' ,                         
          playUrl: '/images/play2.png'                           
        }
      },
      {
        name: 'next',                                            
        img: '/images/next2.png'                                 
      },
      {
        name: 'more',                                             
        img: '/images/more2.png'                                  
      }
    ]
  },
  onLoad(options) {
    const app = getApp()
    // 拿到歌曲的id: options.id
    let getInfoParams = {mediaId: options.id || app.globalData.songInfo.id, contentType: 'story'}
    this.getMedia(getInfoParams).then(() => {
      this.play() 
    })
  },
  async getMedia(params, that = this) {   
    const app = getApp()
    // 模拟请求数据    
    let canplay = wx.getStorageSync('canplay')
    let data = (canplay.filter(n => Number(n.id) === Number(params.mediaId)))[0]
    app.globalData.songInfo = Object.assign({}, data)
    that.setData({ songInfo: data })
    wx.setStorageSync('songInfo', data)
  },
  // 播放列表弹框，一般需要提供通过当前歌曲id查出此歌曲的分页列表，下面是写死数据，实际情况根据接口来
   more() {
    let allPlay = wx.getStorageSync('allList')
    this.setData({
      showList: true,    // true，弹框出现                                                 
      currentId: this.data.currentId || Number(this.data.songInfo.id),  // 当前歌曲id
      canplay: allPlay    // 弹出列表                                          
    })
    // 显示的过度动画
    this.animation.translate(0, 0).step()
    this.setData({
      animation: this.animation.export()
    })
    setTimeout(() => {
      this.setData({
        noTransform: 'noTransform'
      })
    }, 300)
  },
}