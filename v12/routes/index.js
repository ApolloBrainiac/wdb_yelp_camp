var express = require("express"),
    router  = express.Router(),
    passport  = require("passport"),
    User    = require("../models/user");

// Root route
router.get("/", function(req, res){
 res.render("landing"); 
});

// Register form route
router.get("/register", function(req,res){
  res.render("register", {page: "register"});
});

// handle sign up logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  if(req.body.adminCode === 'cornhusker'){
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      return res.render("register", {"error": err.message});
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// show login from
router.get("/login", function(req,res){
  res.render("login", {page: "login"});
});

// handling login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req,res){
});
// logout route
router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});


module.exports = router;