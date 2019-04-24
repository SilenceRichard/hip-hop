Page({
    data:{
        itemList_actionSheet:["选项1","选项2"], //actionSheet配置的菜单项
        index_actionSheet:0 //actionSheet的菜单项数（表示当前点击了第几个选项）
    },
    test_actionsheet(e){
          this.setData({
            index_actionSheet:e.detail.index //这里我们接收了子组件定义的"open"事件，并给变量赋予了子组件中传递的值
          })    //一般我们给data中的变量赋值时，会用到this.setData({})函数
          console.info('改变数据，获取到所选择菜单项的项数：',this.data.index_actionSheet)
    }
})
