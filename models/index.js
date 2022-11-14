const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// Associations:
// 1. Users:
//     - Can have many Posts
User.hasMany(Post, {
    foreignKey: 'user_id'
})

//     - Can have many Comments
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: "cascade"
})

// 2. Posts:
//     - Can have one User
Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: "cascade"
})

//     - Can have many Comments
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: "cascade"
})

// 3. Comments: 
//     - Can have one User
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: "cascade"
})

//     - Can have one Post
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: "cascade"
})

module.exports = { User, Post, Comment };