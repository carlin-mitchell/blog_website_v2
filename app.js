const port = 3000;

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const date = require(__dirname + '/local_modules/date.js');
const _ = require('lodash'); 
const {redirect} = require('express/lib/response');
const mongoose = require('mongoose');

const keys = require(__dirname + '/config.js');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

//######################################## Mongoose Mongo Connection ########################################  
const localOrAtlas = 'atlas' //choose between 'local' or 'atlas' to connect to the appropriate service
const dbName = 'blogSiteDB';

  if (localOrAtlas.toLocaleLowerCase() === 'local'){
    mongoose.connect('mongodb://localhost:27017/' + dbName);
  }
  else if (localOrAtlas.toLocaleLowerCase() === 'atlas'){
    const password = keys.config.ATLAS_PASSWORD;
    mongoose.connect('mongodb+srv://admin-carlin:' + password + '@cluster0.w7dep.mongodb.net/' + dbName);
  }
  else {console.log("CHOOSE AN APPROPRIATE CONNECTION...")};

//######################################## Blog Post Schema and Model #########################################  
const postSchema = new mongoose.Schema({
  title: String,
  date: String,
  body: String 
});

const Post = mongoose.model('Post', postSchema);


// ################################################ "/" #######################################################
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

app.get('/', (req, res) => {
  Post.find({}, (err, foundPosts) => {
    if (err) {
      console.log('There was an error while finding posts.');
    } else {
      res.render('home', {
        posts: foundPosts, 
        homeStartingContent: homeStartingContent
      });
    }
  });
});

// ################################################ "/about" ##################################################
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

app.get('/about', (req, res) => {
  res.render('about', {
    aboutContent: aboutContent,
  });
});

// ################################################ "/contact" ################################################
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get('/contact', (req, res) => {
  res.render('contact', {
    contactContent: contactContent,
  });
});

// ############################################### "/compose" ################################################
app.get('/compose', (req, res) => {
  res.render('compose', {todaysDate: date.getDate()});
});

app.post('/compose', (req, res) => {
  const title = req.body.postTitle;
  const body = req.body.postBody;
  const date = req.body.date ? "Published " + req.body.date: "";
  
  const post = new Post({
    title: title,
    date: date,
    body: body
  });

  post.save(err => {
    if (!err){
      res.redirect('/');
    }
  });
  
});

// ################################################ "/post" ###################################################
app.get('/posts/:postID', (req, res) => {
  let requestedPostID = req.params.postID;
  Post.findOne({_id: requestedPostID}, (err, foundPost) => {
    if (err) {
      console.log(`Could not find post with id: ${requestedPostID}`);
    } else { 
      res.render('post', {
        title: foundPost.title,
        date: foundPost.date,
        body: foundPost.body,
        _id: foundPost._id
      });
    };
  });
});


// ############################################ app.listen() ##########################################
app.listen(process.env.PORT || port, function () {
  console.log('Server started on port ' + port);
});