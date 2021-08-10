// import Guesses from './script.js';
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('cookie-session');
const findOrCreate = require('mongoose-findorcreate');
const app = express();
let id_email;
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended:false , useUnifiedTopology:true }))


mongoose.connect(process.env.dblink, { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
}); 
  mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  guess: [],
});

userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

app.get('/', (req, res) => {
  res.render("signup");
});
app.get("/game", function(req, res){
  res.render("index");
   });

app.post("/register", function(req, res){
  id_email=req.body.email;
User.create({email: req.body.email, password: req.body.password});
res.render("index");
});

app.post("/guess", function(req, res){
  User.findOne({email: id_email},function(err,User) {
    User.guess.push(req.body.guess);
    User.save();
});
});

app.post("/clear", function(req, res){
  // console.log(id_email);
  User.findOne({email: id_email},function(err,User) {
    User.guess=[];
    User.save();
});
});



  let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started");
});
// console.log(Guesses);