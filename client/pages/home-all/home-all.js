// pages/home-all/home-all.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[{name:'综合',flag:false},{name:'个人',flag:false},{name:'官方',flag:false}]
  },
  activeList(ev){
    // console.log(ev.currentTarget.dataset.item)
    // ev.currentTarget.dataset.item.flag = true;
    let arr = this.data.list;
    for (var j = 0; j < arr.length; j++) {
       arr[j].flag = false;
    }
    this.setData({
      list:arr
    })
    for (var i = 0 ; i<arr.length; i++){
      if (arr[i].name == ev.currentTarget.dataset.item.name){
        arr[i].flag = true;
        this.setData({
            list:arr
        })
      }
    }
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
