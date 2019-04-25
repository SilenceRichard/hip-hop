Component({
    properties:{
        type:{
            type:String,
            value:''
            //页脚类型,默认为空，不带链接
            //normal 带一个底部导航链接
            //fixed 固定页面，相当于底部图钉
            //double 双链接
        },
        url:{
            type:String,
            value:''
        },//底部链接,好像不允许跨域
        leftUrl:{
            type:String,
            value:''
        },//左底部链接
        rightUrl:{
            type:String,
            value:''
        },//右底部链接
        text:{
            type:String,
            value:'底部链接'
        },//单链接时的链接文字
        leftText:{
            type:String,
            value:'底部链接'
        },//双链接时左边的链接文字
        rightText:{
            type:String,
            value:'底部链接'
        },//双链接时右边的链接文字
    }
});
