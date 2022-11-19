const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

// Get find all content and post on page
router.get("/", async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: ["id", "title", "content", "created_at"],
            order: [["created_at", "DESC"]],
            include: [{
                model: User,
                attributes: ["username"]
            },
            {
                model: Comment,
                attributes: ["id", "content_com", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            }
        ]
    });
        postData = res.json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET return data of specific post by id
router.get("/:id", async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ["id", "content", "title", "created_at"],
            include: [{
                model: User,
                attributes: ["username"]
            },
            {
                model: Comment,
                attributes: ["id", "content_com", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            }
        ]
        });
        if (!postData) {
            res.status(204).json({ message: "Post not found!"});
            return;
        }
        res.json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST route connect user session and create new post
router.post("/", withAuth, (req,res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id,
    })
    .then((postData) => res.json(postData))
    .catch((err) => {
        res.status(500).json(err);
    });
});

// PUT update post and date
router.put("/:id", withAuth, (req,res) => {
    try {
        const updatePost = Post.update({
            title: req.body.title,
            content: req.body.content,
        }, 
        {
            where: {
                id: req.params.id,
            },
        });
        if (!updatePost) {
            res.status(204).json({ message: "Post not found!"});
            return;
        }
        res.json(updatePost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE post by id
router.delete("/:id", withAuth, (req, res) => {
    try {
        const delPost = Post.destry({
            where: { id: req.params.id },
        })
        if (!delPost) {
            res.status(204).json({ message: "Post not found!"});
            return;
        }
        res.json(delPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;