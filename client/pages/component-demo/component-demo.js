import util from '../../utils/util' //引入常用工具
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
    },
    test_showModal(){
        let obj={  title: '弹窗标题',
            content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
            confirmText: "主操作",
            cancelText: "辅助操作",}
       util.showModalPromisified(obj)
                   .then((res)=>{
           console.log(res)
           if (res.confirm){
               console.log('点击了主操作')
           }else {
               console.log('点击了辅助操作')
           }
       })   //主操作一般是确认键，辅助操作一般是取消键 ，
    },  //弹窗
    test_alert(){
        let obj={
            content: '警示窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
            showCancel: false,
        }
        util.showModalPromisified(obj)
    }  //警示窗
})
