var express = require('express');
var user = require('../models/user');
var post = require('../models/post');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', function (req, res, next) {
  if (req.session.user_id == req.params.id) {
    user.findById(req.params.id).then(user => {
      if (user) {
        res.render("user/wall", { email: req.session.email });
      } else {
        req.session.infoMsg = 'Please register to continue';
        res.redirect("/");
      }
    });
  }
  else {
    req.session.infoMsg = "Please login to continue";
    res.redirect("/");
  }
});

router.get('/:id/posts', function (req, res, next) {
  user.findById(req.params.id, { include: [{ model: post, as: 'posts' }] }).then(user => { res.json(user.posts) });
});

router.get('/:id/posts/:postId', function (req, res, next) {
  user.findById(req.params.id, { include: [{ model: post, as: 'posts' }] }).then(user => {
    var selectedPosts = user.posts.filter(function (item) { return item.id == req.params.postId });
    if (selectedPosts.length) {
      res.json(selectedPosts[0])
    } else {
      res.json({ response: "No posts found" });
    }
  });
});
module.exports = router;