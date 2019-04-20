/**
 * 不带图片的导航栏
  */
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: '', //不存在此属性时
    },
    rightText: {
      type: String,
      value: '', //不存在此属性时
    },
    height: {
      type: String,
      value: '100rpx', //不存在此属性时
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){}
  }
})
