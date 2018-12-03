// page/check_order/check_order.js
var Bmob = require('../../utils/bmob.js');
const app = getApp();
var that;

var products_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    total:0,
    product_ids:[],
    product_numers:[],

    products_infor:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globaldata.check_ids);
    that = this;
    
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    let current = Bmob.User.current();
    that.getaddress(current.objectId);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    that.setData({total:0})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getaddress:function(id)
  {
    wx.showLoading({
      title: '加载中...',
    });
    const query = Bmob.Query("address");
    query.equalTo("parent", "==", id);
    query.order("default,-updatedAt");
    query.find().then(res => {
      wx.hideLoading();
      (res[0] == null) ? that.setData({ address: null }) : that.setData({ address: res[0] });
      that.get_orderdetail();//得到订单详情
    });
  },

  get_orderdetail:function()
  {
    var ids = app.globaldata.check_ids;
    var products_infor = [];
    var index = 0;

    for (var i = 0; i < ids.length; i++) {
      const query = Bmob.Query('order_car');
      query.include("product", "products");
      query.get(ids[i]).then(res => {
        console.log(res);
        that.data.total += res.total;
        products_infor.push(res);
        that.data.product_numers.push(res.number1);
        that.data.product_ids.push(res.product.objectId);
        index++;
        if (i = index) {
          that.setData({ products_infor: products_infor, total: that.data.total });
        }
      })
    }
  },

  //添加地址
  add_address:function()
  {
    wx.navigateTo({
      url: 'add_address/add_address',
    })
  },

  //下单操作
  makeorder:function()
  {
    console.log(that.data.product_numers);
    wx.showModal({
      title: '确定订单信息',
      content: '该订单货到付款，送货上门',
      success(res) {
        if (res.confirm) {
          
          var products = that.data.product_ids;
          let current = Bmob.User.current();
          var userid = current.objectId;
          var product = that.data.products_infor;

          const relation = Bmob.Relation('products'); // 需要关联的表
          const relID = relation.add(products);
          const pointer = Bmob.Pointer('_User');
          const poiID = pointer.set(userid);
          const pointeraddress = Bmob.Pointer('address');
          const poiID_address = pointeraddress.set(that.data.address.objectId);

          const query = Bmob.Query('orders');
          query.set("pay_for", that.data.total);
          query.set("state", "待发货");
          query.set("products", relID);
          query.set("parent", poiID);
          query.set("address_desc", that.data.address.address);
          query.set("length", product.length);
          query.set("desc", product[0].product.name);
          query.set("address", poiID_address);
          query.save().then(res => {
            console.log(res);
            that.sendmessageTmple(res);//发送模板消息

            var index = 0;
            var ids = app.globaldata.check_ids;

            for (var i = 0; i < ids.length; i++) {
              const query = Bmob.Query('order_car');
              query.destroy(ids[i]).then(res => {
                
                const query = Bmob.Query('products');
                query.get(products[index]).then(res => {
                  console.log(res)
                  const query = Bmob.Query('products');
                  query.set('id', res.objectId) //需要修改的objectId
                  query.set('offtake', res.offtake + that.data.product_numers[index]);
                  query.save().then(res => {
                    console.log(res)
                    index++;
                  })
                })
              })
            }

            wx.reLaunch({ url: '../orders/orders' });
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //发送模板消息
  sendmessageTmple:function(res)
  {
    let temp = {
      touser: "oUxY3w-fAaosEuc21uGeAJX66Nfs",
      template_id: "K9-6_Ayj4MLC2yvwY60-cq18tngJHAlqDfsOvv3D7a8",
      data: {
        first: {
          value: "您好，收到新的订单信息",
          color: "#c00"
        },
        tradeDateTime: {
          value: res.createdAt
        },
        orderType: {
          value: "送货上门"
        },
        customerInfo: {
          value: that.data.address.address + that.data.address.name + that.data.address.phone
        },
        orderItemName: {
          value: "商品信息"
        },
        orderItemData: {
          value: that.data.products_infor[0].product.name + "等" + that.data.products_infor.length + "商品"
        },
        remark: {
          value: "如果您十分钟内再次收到此信息，请及时处理。"
        }
      }
    }

    Bmob.notifyMsg(temp).then(function (response) {
      console.log(response);
    })
      .catch(function (error) {
        console.log(error);
      });
  },
})