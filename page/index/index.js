var Bmob = require('../../utils/bmob.js');
var that;
Page({

  /*** 页面的初始数据*/
  data: {
    price:'',
    maskele:"none",
    number_jin:1,
    animationData:''
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    that = this;
    that.getswiperimage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    that.getproductslist();
  },

  /*** 生命周期函数--监听页面隐藏*/
  onHide: function () {

  },

  /*** 用户点击右上角分享*/
  onShareAppMessage: function () {
    return {
      title: '*营养生活每一天*',
      path: '/page/index/index'
    }
  },


  //得到swiperImage和selectItem的地址
  getswiperimage:function(){
    wx.showLoading({
      title: '加载中...',
    });
    const query = Bmob.Query("swiperImgs");
    query.equalTo("active", "==", true);
    query.order("sort");
    query.find().then(res => {
      that.setData({imgs:res});

      //得到selectItems infor
      const query_selectItem = Bmob.Query("selectItem");
      query_selectItem.equalTo("active", "==", true);
      query_selectItem.order("sort");
      query_selectItem.find().then(res => {
        wx.hideLoading();
        that.setData({ selectItems: res })
      });
    });
  },

  getproductslist:function(){
    wx.showLoading({
      title: '加载中...',
    });
    const query_product = Bmob.Query("products");
    query_product.equalTo("is_recommend", "==", true);
    query_product.order("sort");
    query_product.find().then(res => {
      wx.hideLoading();
      that.setData({ products: res })
    });
  },

  //点击显示详情页
  gotodetail:function(e)
  {
    var id = e.currentTarget.dataset.id;
    that.setData({ maskele:"block"});

    wx.showLoading({
      title: '加载中...',
    });
    const query = Bmob.Query('products');
    query.get(id).then(res => {
      wx.hideLoading();

      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      that.animation = animation
      animation.opacity("1").step()

      that.setData({ p_detail: res, allpay: res.price, price: res.price, animationData: animation.export()})

    }).catch(err => {
      console.log(err)
    })
  },

  //maskElement function

  //斤数输入框变化
  getnumber_jin: function (e) {
    this.setData({
      allpay: e.detail.value * that.data.price,
      number_jin: e.detail.value
    })
  },

  hidden:function(){
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    that.animation = animation
    animation.opacity("0").step()
    that.setData({ animationData: animation.export() });
    setTimeout(function () { that.setData({ maskele: "none", number_jin:1})},300);
  },

  //加入购物车功能
  add_ordercar:function(e)
  {
    wx.showLoading({title: '加载中...'});
    var id = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    let current = Bmob.User.current();
    var userid = current.objectId;

    const query = Bmob.Query("order_car");
    query.equalTo("product", "==", id);
    query.equalTo("parent", "==", userid);
    query.find().then(res => {
      if(res.length == 0)
      {
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
      }else
      {
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
            },800)
        }).catch(err => {
          console.log(err)
        })
      }
    });
  },

  goto_category:function(e)
  {
    var type1 = e.currentTarget.dataset.id;
    switch (type1) {
      case '水果': type1 = "fruit"
        break;
      case '蔬菜': type1 = "green"
        break;
    };
    wx.reLaunch({
      url: '../category/category?type='+type1,
    })
  }

})
