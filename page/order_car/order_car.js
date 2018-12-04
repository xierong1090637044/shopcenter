var Bmob = require('../../utils/bmob.js');
const app = getApp()
var that;
var checked;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_off:0,
    products_id:''
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
    if (current == null) { } else {
      wx.showLoading({ title: '加载中...' });
      var userid = current.objectId;
      const query = Bmob.Query("order_car");
      query.equalTo("parent", "==", userid);
      query.include('product', 'products');
      query.find().then(res => {
        wx.hideLoading();
        if(res.length == 0)
        {
          console.log("购物车为空");
          that.setData({ order: null, pay_off: 0 })
        }else{
          that.setData({ order: res, })
          console.log('购物车详情：' + res);
          for (var i = res.length - 1; i >= 0; i--) {
            var price = res[i].number1 * res[i].product.price;
            const query = Bmob.Query('order_car');
            query.set('id', res[i].objectId);
            query.set('total', price);
            query.save();
          }
        }
        
      });
    }
  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {

  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var products_id = e.detail.value;
    var arr_total = [];
    var index = 0;
    var sum = 0;
    that.setData({ pay_off: 0, products_id: products_id});


    for(var i =0;i<products_id.length;i++)
    {
      const query = Bmob.Query('order_car');
      query.get(products_id[i]).then(res => {
        arr_total.push(res.total);
        sum = sum + res.total;
        index++;
        if(i == index)
        {
          that.setData({ pay_off: sum })
        }
      })
    }
  },

  //增加数量
  add_number:function(e)
  {
    var id = e.currentTarget.dataset.id;
    var number1 = e.currentTarget.dataset.number1 + 1;
    var price = e.currentTarget.dataset.price;
    var total = number1*price;
    that.setData({ checked: false, pay_off: 0});
    that.modify_number(id, number1,total);
  },

  //减少数量
  reduce: function (e) {
    var id = e.currentTarget.dataset.id;
    if (e.currentTarget.dataset.number1 == 1)
    {
      wx.showModal({
        title: '提示',
        content: '是否移除该商品',
        success(res) {
          if (res.confirm) {
            that.delete_item(id);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      var number1 = e.currentTarget.dataset.number1 - 1;
      var price = e.currentTarget.dataset.price;
      var total = number1 * price;
      that.modify_number(id, number1, total);
      that.setData({ checked: false, pay_off: 0 });
    }
  },

  //修改数据里order_car的数据
  modify_number:function(id,number1,price)
  {
    const query = Bmob.Query('order_car');
    query.get(id).then(res => {
      console.log(res)
      res.set('number1', number1)
      res.set("total", price)
      res.save();
      that.onShow();
    }).catch(err => {
      console.log(err)
    })
  },

  //删除数据
  delete_item:function(id)
  {
    const query = Bmob.Query('order_car');
    query.destroy(id).then(res => {
      that.onShow();
    }).catch(err => {
      console.log(err)
    })
  },

  switchtab:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },

  //点击去付款
  goto_pay:function()
  {
    console.log(that.data.pay_off);
    app.globaldata.check_ids = that.data.products_id;
    if(that.data.pay_off < 100)
    {
      wx.showModal({
        title: '提示',
        content: '配送金额低于100需收取配送费',
        cancelText:"去添加",
        confirmText:"继续",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../check_order/check_order',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../check_order/check_order',
      })
    }
    
  },

})