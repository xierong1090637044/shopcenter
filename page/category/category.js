var Bmob = require('../../utils/bmob.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftitems: ["蔬菜","水果"],
    select:"",

    price: '',
    maskele: "none",
    number_jin: 1,
    animationData: ''
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    console.log(options);
    that = this;
    switch (options.type) {
      case "fruit":
         that.setData({select:"水果"});
         that.getlistdata("fruit");
         break;
      case "green":
        that.setData({ select: "蔬菜" });
        that.getlistdata("green");
        break;
      default:
        that.setData({ select: "蔬菜" });
        that.getlistdata("green");
        break;
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

  select:function(e)
  {
    var desc = e.currentTarget.dataset.desc;
    that.setData({ select: desc});
    switch(desc){
    case '水果':that.getlistdata("fruit")
        break;
    case '蔬菜': that.getlistdata("green")
        break;
    };
  },

  getlistdata:function(data)
  {
    wx.showLoading({
      title: '加载中...',
    });
    const query = Bmob.Query("products");
    query.equalTo("active", "==", true);
    query.equalTo("type", "==", data);
    query.order("-offtake");
    query.find().then(res => {
      console.log(res);
      wx.hideLoading();
      that.setData({detail:res})
    });
  },

  //点击显示详情页
  godetail: function (e) {
    var id = e.currentTarget.dataset.id;
    that.setData({ maskele: "block" });

    wx.showLoading({
      title: '加载中...',
    });
    
    switch (that.data.select){
      case "水果":that.getlistdeial(id)
        break;
      case "蔬菜": that.getlistdeial(id)
        break;
    };
   
  },

  //maskElement function

  //斤数输入框变化
  getnumber_jin: function (e) {
    this.setData({
      allpay: e.detail.value * that.data.price,
      number_jin: e.detail.value
    })
  },

  hidden: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    that.animation = animation
    animation.rotate("-360").width("10%").left("50%").opacity("0").step()
    that.setData({ animationData: animation.export(), number_jin: 1 });
    setTimeout(function () { that.setData({ maskele: "none", number_jin:1}) }, 500);
  },

  //点击得到详情
  getlistdeial:function(obejctid)
  {
    const query = Bmob.Query("products")
    query.get(obejctid).then(res => {
      wx.hideLoading();
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      that.animation = animation
      animation.rotate("360").width("90%").left("5%").step()

      that.setData({ p_detail: res, allpay: res.price, price: res.price, animationData: animation.export() })

    }).catch(err => {
      console.log(err)
    })
  },


  //加入购物车功能
  add_ordercar: function (e) {
    wx.showLoading({title: '加载中...'})
    var id = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    let current = Bmob.User.current();
    var userid = current.objectId;

    const query = Bmob.Query("order_car");
    query.equalTo("product", "==", id);
    query.equalTo("parent", "==", userid);
    query.find().then(res => {
      if (res.length == 0) {
        const pointer = Bmob.Pointer('_User')
        const poiID = pointer.set(userid)
        const pointer1 = Bmob.Pointer('products')
        const poiID1 = pointer1.set(id)

        const query = Bmob.Query('order_car')
        query.set("parent", poiID)
        query.set("product", poiID1)
        query.set("number1", Number(that.data.number_jin))
        query.set("total", price)
        query.save().then(res => {
          
          wx.hideLoading();
          setTimeout(function () { 
            that.hidden();
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
          }, 800)
        })
      } else {
        var number1 = res[0].number1;
        var total = (number1 + 1) * price;
        const query = Bmob.Query('order_car');
        query.get(res[0].objectId).then(res => {
          console.log(res)
          res.set('number1', number1 + Number(that.data.number_jin))
          res.set("total", total)
          res.save();
          
          wx.hideLoading();
          setTimeout(function () { 
            that.hidden();
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            });
            }, 800)
        }).catch(err => {
          console.log(err)
        })
      }
    });
  }


})