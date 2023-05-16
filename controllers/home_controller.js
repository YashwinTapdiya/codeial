module.exports.home = function(req, res){
   // console.log(req.cookies);
  //  res.cookie('user_id' , 30);
    return res.render('home' ,{
        title: "Home"
    })
    //return res.end('<h1>Express is up for Codeial!</h1>')
}

//by this we can add more actions syntax
// module.exports.actionName = function(req, res){}