/**
 * @name: abumInfo
 * 开发者编写的专辑详情abumInfo,通过专辑id获取播放列表，id在onLoad的options.id取
 * 这里开发者需要提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * 1、在data里定义接口入参的key，因为内部逻辑(如懒加载)会调用这里的函数并传参
 * pageNoName: 'pageNum'        // 分页数
 * pageSizeName: 'pageSize'     // 每页数目
 * idName: 'albumId'            // 这个页面请求的id
 * 2、播放列表：canplay(注：canplay需要存在Storage里面)，把allList赋值为canplay并存在缓存中
 * 4、此专辑总曲目数：total
 * 5、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下
 * list.map((item, index) => {
      item.title = item.mediaName                               // 歌曲名称
      item.id = item.mediaId                                    // 歌曲Id
      item.dt = item.timeText                                   // 歌曲的时常
      item.coverImgUrl = item.coverUrl                          // 歌曲的封面
    })
 */
// import { albumMedia, isAlbumFavorite, fm, albumFavoriteAdd, albumFavoriteCancel } from '../utils/httpOpt/api'
const { showData } = require('../utils/httpOpt/localData')

module.exports = {
  data: {
    pageNoName: 'pageNum',
    pageSizeName: 'pageSize',
    pageSize: 10,   // 分页数用于分页请求和选集
    idName: 'albumId',
    existed: false,                     // 是否被收藏
    playAllPic: '/images/playAll.png'
  },
  onShow() {

  },
  async onLoad(options) {
    let id = options.id
    let params = {id: id}
    this.getData(params)
  },
  onReady() {

  },
  // 获取分页歌曲列表，假数据，这里getData需要支持上拉和下拉的加载，up上拉加载，down下拉加载，pages文件夹下的abumInfo.js会调用这里的getData
  getData(params) {
    let _list = showData.abumInfo.data
    let total = showData.abumInfo.total
    // 上拉和下拉的情况
    if (params.lazy == 'up'){
      _list = this.data.canplay.concat(_list)
     } else if (params.lazy == 'down') {
      _list = _list.concat(this.data.canplay)
     }
     // setTimeout模拟返回时间
    setTimeout(() => {
      this.setData({
        canplay: _list,
        total
      })
    }, 300)
    wx.setStorageSync('canplay', _list)
    wx.setStorageSync('allList', _list)
  }
}