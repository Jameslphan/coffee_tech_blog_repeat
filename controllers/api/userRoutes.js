const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// GET all data of user excluding password
router.get("/", async (req, res) => {
    try {
        const data = await User.findAll({
            attributes: { exclude: ["password"]},
        })
        data = res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET by id all data of user excluding password
router.get("/:id", async (req, res) => {
    try {
        const data = await User.findOne({
            attributes: { exclude: ["password"]},
            where: {
                id: req.params.id,
            },
            include: [{
                model: Post,
                attributes: ["id", "title", "content", "created_at"]
            },
            {
                model: Comment,
                attributes: ["id", "content_com", "created_at"],
                include: {
                    model: Post,
                    attributes: ["title"],
                }
            },
            {
                model: Post,
                attributes: ["title"]
            }
        ]
    });
    if (!data) {
        res.status(204).json({ message: "User not found!"});
        return;
    }
    res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST signup and log to session
router.post("/", (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
    })
    .then ((userData) => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.logged_in = true;
            res.json(userData);
        });
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});


// POST login
router.post("/login", async (req, res) => {
    try {
        const userLog = await User.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (!userLog) {
            res.status(204).json({ message: "Username not found!"});
            return;
        }
        const validPassword = await userLog.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: "Incorrect password!"});
            return;
        }
        req.session.save(() => {
            req.session.user_id = userLog.id;
            req.session.username = userLog.username;
            req.session.logged_in = true;
            res.json({ user: userLog, message: "Loggin in!" });
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// POST logout
router.post("/logout", (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;