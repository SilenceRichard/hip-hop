Component({
    properties:{
        type:{
            type:String,
            value:'primary' //原生按钮类型 有primary,warn,default几类 默认为default，默认样式
        },
        size:{
            type:String,
            value:'' //按钮大小，设置为'mini’为小按钮
        },
        disable:{
            type:Boolean,
            value:false //禁用状态，true为禁用
        },
        plain:{
            type:Boolean,
            value:false //默认为背景填充按钮，'true'为空心按钮
        },
        text:{
            type:String,
            value:'' //按钮文字
        }
    }
});
