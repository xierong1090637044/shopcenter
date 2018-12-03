//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("873b0fd8dbe9e8ff02d9923fe9698bb0", "cbca9557a637b9e82093720dbcfddabf");
App({
  globaldata:{
   check_ids:[]
  },
  onLaunch: function () {
    var that = this;
    Bmob.User.auth().then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err)
    });

  },

})