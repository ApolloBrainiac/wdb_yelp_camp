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
     res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
    }
  });
});

// CREATE -- ADD NEW CAMPGROUNDS
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var cost = req.body.cost;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  geocoder.geocode(req.body.location, function(err,data){
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.ocation.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, cost: cost, description: desc, author: author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
      if(err){
        console.log(err);
      } else {
        req.flash("success", "Campground added.");
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
router.put("/:id", function(req,res){
  geocoder.geocode(req.body.location, function (err,data){
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    // find and update correct camp
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Successfully Updated!");
        res.redirect("/campgrounds/" + req.params.id);
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