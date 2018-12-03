var Bmob = require('../../utils/bmob.js');
var that;
Page({

  /*** 页面的初始数据*/
  data: {
    display1:"none",
    display2:"none"
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    let user = Bmob.User.current();
    console.log(user);

    if (user.islogin == null || user.islogin == false)
    {
      that.setData({
        display1:"block",
        display2: "none",
      })
    }else{
      that.setData({
        display1: "none",
        display2: "block",
        user:user
      })
    }
  },

  /*** 生命周期函数--监听页面初次渲染完成*/
  onReady: function () {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {

  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {

  },

  //获取用户信息
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo);
    let current = new Bmob.User.current();
    var user = e.detail.userInfo;
    var nickname = user.nickName;
    var gender = user.gender;
    var avatar = user.avatarUrl;

    const query = Bmob.Query('_User');
    query.get(current.objectId).then(res => {
      res.set('username', nickname);
      res.set('gender', gender);
      res.set('avatar', avatar);
      res.set('islogin', true);
      res.save();
      setTimeout(function () {
        that.onLoad()
      }, 1000)
    });
  },
})