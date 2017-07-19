var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
    
    
// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//   name: "Granite Hill",
//   image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg",
//   description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!!!"
//   }, function(err, campground){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("NEWLY CREATED CAMPGROUND: ");
//       console.log(campground);
//     }
//   });

var campgrounds = [
      {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
      {name: "Granite Hill", image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg"},
      {name: "Mountain Goat's Rest", image: "https://farm3.staticflickr.com/2353/2069978635_2eb8b33cd4.jpg"},
    ];

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
  campgrounds.push(newCampground);
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
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      // render show template more information about selected campground
      res.render("show", {campground: foundCampground});
    }
  });
});


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The YelpCamp server has started!");
});