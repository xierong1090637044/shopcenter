var Bmob = require('../../utils/bmob.js');
var that;
Page({

  /*** 页面的初始数据*/
  data: {
    have_order_dis:"none",
    no_order_dis:"none",

    options:''
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    console.log(options);
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
    query.order("-createdAt");
    query.find().then(res => {
      var orders = res;
      var index = 0;

      if(res.length == 0)
      {
        wx.hideLoading();
        that.setData({ no_order_dis: "block" });
      }else{
        that.setData({ have_order_dis:"block"});
        for (var i = 0; i < orders.length; i++) {
          const query = Bmob.Query('orders');
          query.field('products', res[i].objectId);
          query.relation('products').then(res => {
            orders[index]["products"] = res.results;

            if (index == (i - 1)) {
              wx.hideLoading();
              console.log(orders);
              that.setData({ orders: orders });
            }
            index++;
          })
        }
      }

      
    })
  },

  switchtab: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  
})