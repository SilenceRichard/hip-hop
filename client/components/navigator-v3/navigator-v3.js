import {formatTime} from '../../utils/util.js'
Component({
  options:{},
  properties:{
    imgUrl:{
      type:String,
      value:'../../static/home.png'
    }, //图片路径
    titleText:{
      type:String,
      value:''
    },//标题文字
    innerText:{
      type:String,
      value: ''
    },//副标题文字
    height:{
      type:String,
      value: '188rpx' //容器高度
    },
    leftWidth:{
      type:String,
      value:'76.7%'
    }, //左宽度 默认80%
    rightWidth:{
      type:String,
      value:'23.3%'
    }
  },
  data:{
    nowDate:formatTime(new Date()) //当前日期
  }
})
