var express = require('express');
var router = express.Router();
var pool = require("./pool")
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/adminmovielogin', function(req, res, next) {
  res.render('loginpage', {message:''});
  
});

router.post('/check_admin_movie_login', function(req, res, next) {
  try{
     pool.query("select * from movieadmins where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
      if (error)
      {
        res.render('loginpage', {message:'Server Error'});
      }
      else
      {
        if(result.length==1)
        { localStorage.setItem('ADMIN',JSON.stringify(result[0]))
          res.render('dashboard', {data:result[0]});
        }
        else
        {
          res.render('loginpage', {message:'Invalid emailid/mobileno/password'});
        }
      }
     })
  }
  catch(e)
  {
    res.render('loginpage', {message:''});
  }
 
  
});

router.get('/logout', function(req, res, next) {
  localStorage.clear()
  res.render('loginpage', {message:''});
  
});


module.exports = router;
