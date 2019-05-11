// pages/dance-settings/dance-settings.js
Page({
  data: {
    step:0, //记录填报表单的步骤数
    info:{},//存入数据库的约局信息对象
    checkboxItems: [
      {name: 'Hiphop', value: 'Hiphop', checked: true},
      {name: 'Popping', value: 'Popping'},
      {name: 'Locking', value: 'Locking'},
      {name: 'Breaking', value: 'Breaking'},
      {name: 'Waacking', value: 'Waacking'},
      {name: 'House', value: 'House'},
      {name: 'Jazz', value: 'Jazz'},
      {name: 'Urban', value: 'Urban'},
      {name: 'Krumping', value: 'Krumping'},
      {name: 'Reggae', value: 'Reggae'},
      {name: '不限', value: '不限'},
    ],//记录舞种信息
  },
  setInfo(ev){//点击事件
    console.log(ev)
    let obj = this.data.info;//中间量
    let step0 = this.data.step;//中间量
    step0++;
    if (this.data.step == 0){
      obj.identify = ev.target.dataset.identify; //身份
    }
    if (this.data.step == 1) {
      obj.type = ev.target.dataset.type; //活动形式
    }
    if (this.data.step ==2){
      obj.dance_type = this.data.checkboxItems;//舞种
    }
    if (this.data.step == 3) {
      
    }
    this.setData({
      info:obj,
      step:step0
    })//由中间量导入数据

    console.log(this.data.info,'----------',this.data.step)
  },
  chooseImage() {//上传图片点击事件
  
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems,
        values = e.detail.value;
       console.log(values)
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if(checkboxItems[i].value == values[j]){
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },//记录舞种信息


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