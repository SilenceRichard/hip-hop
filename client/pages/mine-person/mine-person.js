import ajax from '../../utils/ajax'
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
const app = getApp();
Page({
    data: {
        userInfo: {
            avatarUrl: "",
            nickName: "",
            gender: '',
            birthday: "",
            // region: ['广东省', '广州市', '海珠区'],
            city:'',
            region: [],
            role: "  ",
            danceType: [
                {name: 'Hiphop', value: 'Hiphop', checked: false},
                {name: 'Popping', value: 'Popping', checked: false},
                {name: 'Locking', value: 'Locking', checked: false},
                {name: 'Breaking', value: 'Breaking', checked: false},
                {name: 'Waacking', value: 'Waacking', checked: false},
                {name: 'House', value: 'House', checked: false},
                {name: 'Jazz', value: 'Jazz', checked: false},
                {name: 'Urban', value: 'Urban', checked: false},
                {name: 'Krumping', value: 'Krumping', checked: false},
                {name: 'Reggae', value: 'Reggae', checked: false},
                {name: '不限', value: '不限', checked: false},
            ],
            danceTypeFormat: [],
            danceAge: "",
            introduction: "",
        }, //用户信息（假数据）
        bgImage:app.globalData.bgSrc,
        genterarray: ["保密", "男生", "女生"],
        identyarray: ["学生", "其他社会人员"],
        agearray: ["一年以下", "一到三年", "三年以上"],
        region: ['广东省', '广州市', '海珠区'],
        danceType: [
            {name: 'Hiphop', value: 'Hiphop', checked: false},
            {name: 'Popping', value: 'Popping', checked: false},
            {name: 'Locking', value: 'Locking', checked: false},
            {name: 'Breaking', value: 'Breaking', checked: false},
            {name: 'Waacking', value: 'Waacking', checked: false},
            {name: 'House', value: 'House', checked: false},
            {name: 'Jazz', value: 'Jazz', checked: false},
            {name: 'Urban', value: 'Urban', checked: false},
            {name: 'Krumping', value: 'Krumping', checked: false},
            {name: 'Reggae', value: 'Reggae', checked: false},
            {name: '不限', value: '不限', checked: false},
        ],//记录舞种信息
        openid: '',//操作用户的openid
        showTopTips: false, //错误提示标志
        showModalFlag: false,
        showLimitFlag: false,
    },

    changeImage: function () {
        let that = this;
        wx.chooseImage({
            count: 1,
            success(chooseResult) {
                wx.cloud.uploadFile({
                    cloudPath: util.uuid() + 'my-person-photo.png',
                    filePath: chooseResult.tempFilePaths[0],
                    success: res => {
                        that.setData({
                            "userInfo.avatarUrl": res.fileID,//云存储图片路径
                        });
                    },
                })
            },
        })
    },//头像
    changeInputVal: function (e) {
        this.setData({
            "userInfo.nickName": e.detail.value
        })
        console.log("昵称变为", this.data.userInfo.nickName);
    }, //昵称
    changeSex: function (e) {
        this.setData({
            "userInfo.gender": e.detail.value
        })
        console.log("性别变为", this.data.userInfo.gender);
    }, //性别
    bindDateChange: function (e) {
        this.setData({
            "userInfo.birthday": e.detail.value
        })
        console.log("生日变为", this.data.userInfo.birthday);
    }, //生日
    regionChange: function (e) {
        console.log(e)
        console.log(typeof e.detail.value)
        let str = `${e.detail.value[1]}-${e.detail.value[2]}`  //拼接地区
        this.setData({
            "userInfo.city":str,
            "userInfo.region": e.detail.value
        })
        console.log("地址变为", this.data.userInfo.region)
    }, //地址
    changeRole: function (e) {
        this.setData({
            "userInfo.role": this.data.identyarray[e.detail.value]
        })
        console.log("身份变为", this.data.userInfo.role);
    },//身份
    chooseDanceType: function (e) {
        console.log(e.detail.value)
        let arr = e.detail.value; //勾选事件传递的数组
        let type = this.data.danceType; //用type记录data中的舞种
        type.forEach(item => {
            item.checked = false;
        }) //先把默认勾选状态赋予否
        arr.forEach(item => {
            type.forEach(val => {
                if (item == val.name) {
                    val.checked = true;
                }
            })
        })
        let info = this.data.userInfo;
        info.danceType = type;
        //console.log(type)
        this.setData({
            userInfo: info,
            danceType: type
        })
    }, //舞种类型
    chooseDanceAge: function (e) {
        console.log(e)
        this.setData({
            "userInfo.danceAge": this.data.agearray[e.detail.value]
        })
        console.log("舞龄变为", this.data.userInfo.danceAge);
    }, //舞龄
    changeIntroduction: function (e) {
        this.setData({
            "userInfo.introduction": e.detail.value
        })
        console.log("个人介绍变为", this.data.userInfo.introduction);
    }, //个人介绍
    forMatterDanceType: function () {
        console.log(this.data.userInfo.danceType)
        let arr = this.data.userInfo.danceType.map(item => {
            if (item.checked) return item.name
        })
        arr = arr.filter(item => {
            if (item != null) return item
        })
        this.setData({
            danceTypeFormat: arr
        })
    },
    showModal: function () {
        this.setData({
            showModalFlag: true
        })
    },//打开改变舞种的框
    hideModal: function () {
        let num = 0;
        this.data.userInfo.danceType.forEach((item) => {
            if (item.checked == 1) num++;
        })
        if (num > 3) {
            this.setData({
                showLimitFlag: true
            })
        } else {
            this.forMatterDanceType();
            this.setData({
                showModalFlag: false
            })
        }
        console.log("showLimitFlag变为", this.data.showLimitFlag);
       
    },//关闭改变舞种的框
    hideLimit: function () {
        this.setData({
            showLimitFlag: false
        })
    },//关闭提示框
    saveUserInfo: async function () {
        var that = this;
        //console.log(this.data.userInfo)
        this.data.userInfo.openid = app.data.openid
        console.log('更新信息-----', this.data.userInfo)
        let result = await wx.cloud.callFunction({//调用云函数更新
            name: 'mine',
            data: {
                method: 'updateMineInfo',
                info: this.data.userInfo,
                openid: app.data.openid
            }
        })
        console.log('更新成功，返回值---', result)
        await wx.showToast({
            title: '用户信息已更新!',
            icon: 'success',
            duration: 2000
        },
        wx.navigateBack()
        );//显示框
        
        // ajax.find_page({"_openid":that.data.openid},1,10,'user')
        //     .then(res =>{
        //         let id = res[0]._id;
        //         delete that.data.userInfo._openid;
        //         delete that.data.userInfo._id;
        //         ajax.update(res[0]._id,that.data.userInfo,'user').then(
        //             util.showToast({
        //                 title: '用户信息已更新!',
        //                 icon: 'success',
        //                 duration: 3000
        //             }).then(
        //                 ()=>{
        //                     that.setData({
        //                         edit:false
        //                     })
        //                 }
        //
        //             )
        //         )
        //     })

        //错误提示，暂不用此逻辑，后期需加上
        // this.setData({
        //     showTopTips: true
        // });
        // setTimeout(function(){
        //     that.setData({
        //         showTopTips: false
        //     });
        // }, 3000);
    }, //保存用户信息
    getMineInfo: async function () {
        let result = await wx.cloud.callFunction({
            name: "mine",
            // 传给云函数的请求参数，在云中为event.属性名
            data: {
                method: "getMineInfo",
                openid: app.data.openid,
            },
        })
        console.log("传回用户信息-----", result.result.res)
        if (typeof result.result.res != 'undefined') {
            this.setData({
                userInfo: result.result.res
            })
            this.forMatterDanceType();
            console.log("用户信息不为空，已载入前台")
        }
    },
    onLoad: async function (info) {
        //在页面加载时，根据传过来的id，查询数据库中的用户信息
        //小程序的路由传参 和get请求一样 ?后拼接参数进行传递
        //接受参数的形式为一对象
        console.log("openid传过来啦-----", info.openid)
        var that = this;
        that.setData({
            openid: info.openid
        })
        this.getMineInfo();
    }//加载用户已有信息
})
