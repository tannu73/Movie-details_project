var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


/* GET home page. */
router.get('/movie_interface', function(req, res, next) {
  try{
   var admin=JSON.parse(localStorage.getItem('ADMIN'))
   console.log("ADMIN",admin)
   if(admin==null)
   {
    res.render('loginpage',{message:''});
   }
   else
   {res.render('movieinterface',{message:''});}
  }
  catch(e)
  {
    res.render('loginpage',{message:''});
  }
});

router.post('/movie_submit',upload.single('picture'), function (req, res, next) {
  try {
    console.log("DATA:", req.body)
    console.log("FILE:",req.file)
    pool.query("insert into movies (stateid, cityid, cinemaid, screenid, moviename, description, status, moviepicture) values(?,?,?,?,?,?,?,?)", [req.body.stateid, req.body.cityid, req.body.cinemaid, req.body.screenid, req.body.moviename, req.body.description, req.body.status, req.file.filename], function (error, result) {
      if (error) {
        console.log("D ERROR", error)
        res.render('movieinterface', { message: 'Database Error' });
      }
      else {
        res.render('movieinterface', { message: 'Submitted Successfully...' });
      }
    })
  }
  catch (e) {
    console.log("ERROR:", e)
    res.render('movieinterface', { message: 'Server Error' });
  }

});

router.get('/fetch_movie_state', function (req, res, next) {
  try {
    
    pool.query("select * from state", function (error, result) {
      if (error) {
        console.log("D ERROR", error)
        res.status(200).json([])
      }
      else {
        res.status(200).json({result:result})
      }
    })
  }
  catch (e) {
    console.log("ERROR:", e)
    res.render('movieinterface', { message: 'Server Error' });
  }
 

});

router.get('/fetch_movie_city', function (req, res, next) {
  try {
    
    pool.query("select * from city where stateid=?",[req.query.typeid], function (error, result) {
      if (error) {
        console.log("D ERROR", error)
        res.status(200).json([])
      }
      else {
        res.status(200).json({result:result})
      }
    })
  }
  catch (e) {
    console.log("ERROR:", e)
    res.render('movieinterface', { message: 'Server Error' });
  }
 

});

router.get('/fetch_movie_cinema', function (req, res, next) {
  try {
    
    pool.query("select * from cinema", function (error, result) {
      if (error) {
        console.log("D ERROR", error)
        res.status(200).json([])
      }
      else {
        res.status(200).json({result:result})
      }
    })
  }
  catch (e) {
    console.log("ERROR:", e)
    res.render('movieinterface', { message: 'Server Error' });
  }
 

});

router.get('/fetch_movie_screen', function (req, res, next) {
  try {
    
    pool.query("select * from screen where cinemaid=?",[req.query.typeid], function (error, result) {
      if (error) {
        console.log("D ERROR", error)
        res.status(200).json([])
      }
      else {
        res.status(200).json({result:result})
      }
    })
  }
  catch (e) {
    console.log("ERROR:", e)
    res.render('movieinterface', { message: 'Server Error' });
  }
 

});


router.get('/fetch_all_details', function (req, res, next) {
  try {
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    console.log("ADMIN",admin)
    if(admin==null)
    {
     res.render('loginpage',{message:''});
    }
    
    pool.query("select M.*,(Select S.statename from state S where S.stateid=M.stateid) as statename,(Select C.cityname from city C where C.cityid=M.cityid) as cityname,(Select C.cinemaname from cinema C where C.cinemaid = M.cinemaid) as cinemaname, (Select S.screenname from screen S where S.screenid = M.screenid) as screenname from movies M" ,function (error, result) {
      if (error) {
        console.log("D ERROR", error)
        res.render("displayalldetails",{data:[],message:"Database Error"})
      }
      else {
        res.render("displayalldetails",{data:result,message:"Success"})
      }
    })
  }
  catch (e) {
    console.log("ERROR:", e)
    res.render("loginpage",{message:""})
  }
 

});

router.get('/displayforedit', function (req, res, next) {
  try {
    
    pool.query("select M.*,(Select S.statename from state S where S.stateid=M.stateid) as statename,(Select C.cityname from city C where C.cityid=M.cityid) as cityname,(Select C.cinemaname from cinema C where C.cinemaid = M.cinemaid) as cinemaname, (Select S.screenname from screen S where S.screenid = M.screenid) as screenname from movies M  where M.movieid=?",[req.query.movieid], function (error, result) {
      if (error) {
        console.log("D ERROR", error)
        res.render("displayforedit",{data:[],message:"Database Error"})
      }
      else {
        res.render("displayforedit",{data:result[0],message:"Success"})
      }
    })
  }
  catch (e) {
    console.log("ERROR:", e)
    res.render("displayforedit",{data:[],message:"Server Error"})
  }
 

});

router.post('/edit_movie',function(req,res){
  try{
      
      
      pool.query("update movies set stateid=?, cityid=?, cinemaid=?, screenid=?, moviename=?, description=?,status=? where movieid=?",[ req.body.stateid, req.body.cityid, req.body.cinemaid, req.body.screenid, req.body.moviename, req.body.description, req.body.status,req.body.movieid],function(error,result){
     
          if(error)
          {
              console.log("D ERROR",error)
              res.redirect('/movies/fetch_all_details')
          }
          else{
              res.redirect('/movies/fetch_all_details')

          }
      })
  
  
  }
  catch(e)
  { console.log("Error",e)
  res.redirect('/movies/fetch_all_details')

  }
  
  })

  router.get('/displaypictureforedit', function (req, res, next) {
    res.render("displaypictureforedit",{data:req.query})
  
  })
  
  router.post('/edit_picture',upload.single('moviepicture'), function (req, res, next) {
    try {
  
      pool.query("update movies set moviepicture=? where movieid=?", [req.file.filename, req.body.movieid], function (error, result) {
        if (error) {
         res.redirect('/movies/fetch_all_details')
        }
        else {
          res.redirect('/movies/fetch_all_details')
        }
      })
  
    }
    catch (e) {
      res.redirect('/movies/fetch_all_details')
    }
  
  });
  
  router.get('/login_page', function(req, res, next) {
    res.render('loginpage', { title: 'Express' });
  });


module.exports = router;
