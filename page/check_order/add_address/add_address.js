// page/check_order/add_address/add_address.js
var Bmob = require('../../../utils/bmob.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let current = Bmob.User.current();
    that.getaddreslist(current.objectId);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  //得到地址列表
  getaddreslist:function(id)
  {
      wx.showLoading({
        title: '加载中...',
      });
      const query = Bmob.Query("address");
      query.equalTo("parent", "==", id);
      query.order("default,-updatedAt");
      query.find().then(res => {
        wx.hideLoading();
        that.setData({ address: res });
        console.log(res);
      });
  },

  //选择地址事件
  select_address:function(e)
  {
    var id = e.currentTarget.dataset.id;
    console.log(id);

    const query = Bmob.Query('address');
    query.set('id', id) //需要修改的objectId
    query.set('default', 1)
    query.save().then(res => {
      wx.navigateBack({ delta: 1 })
    })
  },

  //添加新地址
  add_address:function()
  {
    wx.navigateTo({
      url: '../new_address/new_address',
    })
  }

})