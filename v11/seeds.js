var mongoose    = require("mongoose"),
    Campground  = require("./models/campgrounds"),
    Comment     = require("./models/comment");
    
var data = [
    {
      name: "Cloud's Rest",
      image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
      description: "man convenience store alcohol skyscraper skyscraper futurity drugs -ware. industrial grade garage human augmented reality singularity office monofilament denim. gang Chiba ablative grenade chrome post- post- numinous."
    },
    {
      name: "Butt Town",
      image: "http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg",
      description: "alcohol computer office shanty town nodality bridge spook denim. Chiba into neural free-market shanty town rifle plastic boat. systemic shrine motion tube sprawl garage post- disposable."
    },
    {
      name: "Camp Swole",
      image: "http://www.cityofspearfish.com/PRF/Campground/Campground%201scaled.jpg",
      description: "tank-traps savant industrial grade apophenia knife tiger-team meta- hacker. voodoo god ablative marketing singularity sunglasses dolphin A.I. fetishism. bridge papier-mache gang Legba crypto- wonton soup order-flow systemic."
    }
  ];

function seedDB(){
  // Remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    } else {
      console.log("removed campers!");
      // add some
      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if(err){
            console.log(err);
          } else {
            console.log("Campgrounds Added!");
            // create a comment
            Comment.create(
              {
                text: "This place is great, but it got really fucking scary once the undead miner showed up.",
                author: "Homer"
              }, function(err, comment){
                if(err){
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment");
                }
              });
            }
          });
        });
      }
    });
  
  // add words
  }

module.exports = seedDB;