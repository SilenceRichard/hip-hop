Page({
   goRequest(){
     wx.request({
       url:" http://localhost:80/test",
       data:{a:1},
       header:{
         // "Content-Type":"application/json"
       },
       success:function(res){
         console.log(res.data)
       },
       fail:function(err){
         console.log(err)
       }

     })
   }
})
