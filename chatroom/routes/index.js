var express = require('express');
var router = express.Router();
var checkId = function (req, res, callback) {
  var username = req.body['id'];
  var pwd = req.body['pwd'];
    callback();  
}
var isLogin=function(req,res){
  var user=req.signedCookies.user;
  if(!user){
    return res.redirect('/');
  }

}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '微型聊天室' });
});
router.get('/socket', function(req, res, next) {
  res.render('socket');
});

router.get('/chat', function(req, res, next) {
  isLogin(req,res);
  res.render('chatbox',{name:req.signedCookies.user});
});

router.get('/signup', function (req, res, next) {
  // checkLoginState(req, res);
  res.render('signup');
});

router.get('/signout', function (req, res, next) {
  // checkLoginState(req, res);
  res.clearCookie('user',{path:'/'});
  res.clearCookie('pwd',{path:'/'});
  return res.redirect('/');
});

router.post('/signup', function (req, res, next) {

  checkId(req, res, function () {
    console.log('開始註冊程序')
    if (req.body['pwd'] != req.body['pwd2']) {
      console.log('pwd!=pwd2');
      res.render('signup' ,{msg:'密碼不一致'});
    } else {
      var obj = {
        username: req.body['id'],
        pwd: req.body['pwd']
      };

      res.cookie('user', req.body['id'], { path: '/', signed: true });
      res.cookie('pwd', req.body['pwd'], { path: '/', signed: true });
      return res.redirect('/chat');
    }
  });

});

module.exports = router;
