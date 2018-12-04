var Bmob = require('../../utils/bmob.js');
var that;
Page({

  /*** 页面的初始数据*/
  data: {
    have_order_dis:"none",
    no_order_dis:"none",

    limit:10
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    that.getorderlist();
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


  /*** 用户点击右上角分*/
  onShareAppMessage: function () {

  },

  getorderlist:function()
  {
    wx.showLoading({title: '加载中...',});
    let current = Bmob.User.current();
    var userid = current.objectId;

    const query = Bmob.Query('orders');
    query.equalTo("parent", "==", userid);
    query.include("address","address");
    query.limit(that.data.limit);
    query.order("-createdAt");
    query.find().then(res => {
      var orders = res;
      var index = 0;
      console.log(res);

      if(res.length == 0)
      {
        wx.hideLoading();
        that.setData({ no_order_dis: "block" });
      }else{
        wx.hideLoading();
        that.setData({ have_order_dis: "block", orders: res});
      }
      
    })
  },

  switchtab: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },

  //滚到到一定距离加载更多订单
  get_moreorders:function(e)
  {
    that.setData({limit:that.data.limit+10});
    that.getorderlist();
  },

  //去到订单详情
  goto_detail:function(e)
  {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail/detail?id='+id,
    })
  }
  
})