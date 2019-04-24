/*
*Created by Zhao Fangge on 2019/4/24
*/
Component({
    properties:{
        name:{
            type:String,
            value:"弹出式菜单"
        },// 按钮名称，默认为弹出式菜单
        list:{
            type:Array,
            value: ["默认菜单项"] //菜单数组，设置菜单项，默认为空
        }
    },
    data:{

    },
    methods:{
        open: function(ev){
            var that = this;  //this在JS中是一个很重要的概念,可以理解为指针，
            // 用that获取到外部的this指向，防止闭包而产生的this指向错误（具体可以百度一下，这里解释起来比较费劲-。-）
            wx.showActionSheet({
                itemList: ev.target.dataset.list,
                //事件触发时会默认传递一个对象，我们用ev这个变量接收事件对象
                // 参数我们用data-参数名传递，如这里我传递的参数是data-list,写在wxml里
                success: function(res) {
                    if (!res.cancel) {
                        var event_detail = {
                            index:res.tapIndex
                        }
                        // open为自定义名称事件，在父组件中使用，这是子组件给父组件（调用它的页面传参的示例）
                        //子组件发送名为open的事件，将我们规定的event_detail的数据传递
                        that.triggerEvent('open',event_detail)
                    }
                }
            });
        }
    }
});
