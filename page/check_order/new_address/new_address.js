// page/check_order/new_address/new_address.js
var Bmob = require('../../../utils/bmob.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let current = Bmob.User.current();
    var userid = current.objectId;
    var detail = e.detail.value;
    var name = detail.name;
    var phone = detail.phone;
    var address = detail.address;
    var addressdetail = detail.addressdetail;
    var checked = detail.checkbox[0];

    if(name == "" || phone =="" || address==""||addressdetail=="")
    {
      wx.showToast({
        title: '请填写完整',
        icon:"none"
      })
    } else if (phone.length <11)
    {
      wx.showToast({
        title: '请填写正确的手机号',
        icon: "none"
      })
    }else
    {
      const pointer = Bmob.Pointer('_User');
      const poiID = pointer.set(userid);

      const query = Bmob.Query('address');
      query.set("name", name);
      query.set("phone", Number(phone));
      query.set("address", address+addressdetail);
      query.set("parent", poiID);
      if (checked) { query.set("default", 1); } else { query.set("default", 2);}
      query.save().then(res => {
        wx.showToast({
          title: '保存成功',
        });
        wx.navigateBack({delta:1})
      })
    }
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },

  
})