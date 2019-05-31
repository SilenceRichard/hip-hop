import ajax from '../../utils/ajax'
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImage: app.globalData.bgSrc,
    content:'',
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: '13120327299' //仅为示例，并非真实的电话号码
    })
  },

  putonAdvice(e){
    this.setData({
      content: e.detail.value
    })
    console.log("content变为", this.data.content);
  },

  submit: async function () {
    var that = this;
    //console.log(this.data.userInfo)
    //console.log('更新信息-----', this.data.userInfo)
    let result = await wx.cloud.callFunction({//调用云函数更新
      name: 'mine',
      data: {
        method: 'sendAdvice',
        info: this.data.content,
        openid: app.data.openid,
      }
    })
    console.log('已提交', this.data.content)
    //console.log('更新成功，返回值---', result)
    await wx.showToast({
      title: '提交成功!',
      icon: 'success',
      duration: 3000
    })//显示框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})