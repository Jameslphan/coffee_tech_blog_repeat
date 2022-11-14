const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./dataUser.json');
const postData = require('./dataPost.json');
const commentData = require('./dataComment.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate( userData, {
    individualHooks: true,
    returning: true,
  });

  await Post.bulkCreate( postData, {
    returning: true,
  });
  
  await Comment.bulkCreate( commentData, {
    returning: true,
  });

  process.exit(0);
};

seedDatabase();