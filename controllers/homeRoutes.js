const router = require('express').Router();
const { User, Post, Comment } = require("../models");
const withAuth = require('../utils/auth');
const sequelize = require("../config/connection");

// GET route for all posts
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [{ 
        model: Comment,
        attributes: ['id', 'content_com', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  });
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render("homepage", { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET posts by id
router.get("/post/:id", async (req, res) => {
  try { 
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "content", "title", "created_at"],
      include: [{
        model: Comment,
        attributes: ['id', 'content_com', 'user_id', 'post_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  });
    if (!postData) {
      res.status(204).json({ message: "There are no post found from this user."});
      return;
    }
    const post = postData.get({ plain: true });
    res.render("singlepost", { post, logged_in: req.session.logged_in});
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET login route or redirect to login
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// GET signup route
router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;
