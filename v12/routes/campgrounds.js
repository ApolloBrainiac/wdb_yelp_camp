var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campgrounds"),
    middleware  = require("../middleware"),
    geocoder    = require("geocoder");

// INDEX -- SHOW ALL CAMPGROUNDS

router.get("/", function(req, res){
     // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
     res.render("campgrounds/index", {campgrounds:allCampgrounds});
    }
  });
});

// CREATE -- ADD NEW CAMPGROUNDS
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  var cost = req.body.cost;
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});

// NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
  // find the campground with id
  // render show template more information about selected campground
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground);
      // render show template more information about selected campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
  Campground.findById(req.params.id, req.body.campground, function(err, foundCampground){
    if(err){
      req.flash("error", "Campground not found.");
    }
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});
    //do they own campground?
    
  // if not, redirect
  


// UPDATE
router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

// DESTROYYYYYYYYYYY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash("error", err);
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground eradicated.")
      res.redirect("/campgrounds");
    }
  });
});



module.exports = router;