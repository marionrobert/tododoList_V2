//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

// create the schema
const itemsSchema = {
  name: {
    type: String,
    required: true
  }
};

// create the model based on the schema
const Item = mongoose.model("Item", itemsSchema);

// create documents and insert them it DB
const item1 = new Item({name: "Cooking"})
const item2 = new Item({name: "Wahsing"})
const item3 = new Item({name: "Go shopping"})

const defaultItems = [item1, item2, item3]


app.get("/", function(req, res) {
  Item.find(function(err, results) {
    if (results.length === 0){
      Item.insertMany(defaultItems, function(err, result){
        if (err){
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
          console.log(result);
        }
      });
      res.redirect("/");
    } else {
      if (err) {
        console.log(err);
      } else {
        res.render("list", {listTitle: "Today", newListItems: results});
      }
    }
  });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const newItem = new Item({name: itemName})
  newItem.save()
  res.redirect("/")
});

app.post("/delete", function(req, res){
  const IdcheckedItem = req.body.checkbox
  Item.findByIdAndRemove(IdcheckedItem, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log(`${IdcheckedItem} deleted`)
      res.redirect("/")
    }
  })
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
