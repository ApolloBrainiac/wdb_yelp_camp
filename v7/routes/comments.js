var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground  = require("../models/campgrounds"),
    Comment     = require("../models/comment");


// Comments New
router.get("/new", isLoggedIn, function(req,res){
  // find by id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// Comments Create
router.post("/comments", isLoggedIn, function(req,res){
  // lookup using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
  // create a new one
  // connect new comment to campground
  // redirect campground show page
});

// Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;