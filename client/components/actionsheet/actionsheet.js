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
            wx.showActionSheet({
                itemList: ev.target.dataset.list,
                //事件触发时会默认传递一个对象，我们用ev这个变量接收事件对象
                // 参数我们用data-参数名传递，如这里我传递的参数是data-list,写在wxml里
                success: function(res) {
                    if (!res.cancel) {
                        console.log(res.tapIndex)
                    }
                }
            });
        }
    }
});
