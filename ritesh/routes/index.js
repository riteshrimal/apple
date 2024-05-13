const express = require('express');
const router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const  connectDB = require('./users');

const passport = require('passport');
const upload = require('./multer')

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
const { error } = require('console');

const dpupload = require('./multer');


// Home Page
router.get('/', function(req, res, next) {
  res.render('index');
});

// Registration Page


// Registration Endpoint

router.get('/register', function(req, res){
  const { error } = req.query;
  res.render('register', { error });
});

router.post('/register', async (req, res) => {
  try {
    const { fullname, username, password } = req.body;

    // Check if username already exists in the database
    const existingUser = await userModel.findOne({ username });

    if (existingUser) {
      // If username exists, redirect to the registration page with an error message
      return res.redirect('/register?error=Username is already taken.');
      failureFlash: true;
      
    }

    // Continue with the registration process if the username is available
    const newUser = new userModel({
      username: username,
      fullname: fullname
    });

    // Register the user
    await userModel.register(newUser, password);
    passport.authenticate("local")(req, res, function() {
      res.redirect('/profile');
    });

  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'An error occurred during registration.', error: error });
  }
});

// Login Page
router.get('/login', function(req, res) {
  res.render('login',{error:req.flash('error')});
});


// Login Endpoint
router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}),function(req,res){

});



router.get('/feed', isLoggedIn, async function(req, res, next) {
  try {
    const allPosts = await postModel.find().populate('user'); // Populate the 'user' field if needed
    res.render('feed', { posts: allPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    next(error);
  }
});







// Profile Page
router.get('/profile', isLoggedIn,async function(req, res) {
  const user= await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts") 
  res.render('profile',{user});
});

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


router.post('/dp-upload', isLoggedIn, dpupload.single('dp'), async function(req, res, next) {
  if (!req.file) {
    return res.status(400).send('No files were uploaded. Go Back To the Profile page!!');
  }
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  user.dp = req.file.filename;
  await user.save();
  res.redirect('/profile');
});



router.post('/upload', isLoggedIn, upload.single('file'), async function(req, res, next) {
  if (!req.file) {
    return res.status(400).send('No files were uploaded. Go Back To the Profile page!!');
  }
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  const postdata = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id,
  });
  user.posts.push(postdata._id);
  await user.save();
  res.redirect('/profile');
});














// Delete all users endpoint
router.get('/delete-users', async (req, res, next) => {
  try {
    // Delete all users
    await userModel.deleteMany({});
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});
// Handle other errors



router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
  });





router.get("/test",function(req,res){
  res.render('test');
});

module.exports = router;




