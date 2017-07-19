var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campgrounds"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();


app.get("/", function(req, res){
 res.render("landing"); 
});


// INDEX -- SHOW ALL CAMPGROUNDS

app.get("/campgrounds", function(req, res){
      // Get all campgrounds from DB
      Campground.find({}, function(err, allCampgrounds){
        if(err){
          console.log(err);
        } else {
         res.render("index", {campgrounds:allCampgrounds}); 
        }
      });
});

// CREATE -- ADD NEW CAMPGROUNDS
app.post("/campgrounds", function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW - SHOW FORM TO CREATE NEW CAMPGROUND
app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
  // find the campground with id
  // render show template more information about selected campground
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground);
      // render show template more information about selected campground
      res.render("show", {campground: foundCampground});
    }
  });
});


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The YelpCamp server has started!");
});