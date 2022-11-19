const router = require("express").Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET user's posts
router.get("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ["id", "title", "content", "created_at"],
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
    res.render('dashboard', { posts, logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET logged in user can see and edit post
router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "created_at"],
      include: [{
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'content_com', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
    });
    if (!postData) {
      res.status(204).json({ message: "There are no post found from this user."});
      return;
    }
    const post = postData.get({ plain: true });
    res.render("editpost", { post, logged_in: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET renders new post page
router.get("/new", (req, res) => {
  res.render("addpost");
});

module.exports = router;