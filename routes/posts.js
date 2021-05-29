const express = require("express");
const router = express.Router();
const { posts, likes } = require("../models");
const { validateToken } = require("../middlewares/authMiddleware");

router.get("/", validateToken, async (req, res) => {
	const listOfPosts = await posts.findAll({ include: [likes] });
	const likedPosts = await likes.findAll({ where: { userId: req.user.id } });
	res.json({ listOfPosts, likedPosts });
});

router.get("/byId/:id", async (req, res) => {
	const id = req.params.id;
	const post = await posts.findByPk(id);
	res.json(post);
});

router.get("/byUserId/:id", async (req, res) => {
	const id = req.params.id;
	const listOfPost = await posts.findAll({
		where: { userId: id },
		include: [likes],
	});
	res.json(listOfPost);
});

router.post("/", validateToken, async (req, res) => {
	const post = req.body;
	post.username = req.user.username;
	post.userId = req.user.id;
	await posts.create(post);
	res.json(post);
});

router.put("/title", validateToken, async (req, res) => {
	const { newTitle, id } = req.body;
	await posts.update({ title: newTitle }, { where: { id } });
	res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
	const { newPostText, id } = req.body;
	await posts.update({ postText: newPostText }, { where: { id } });
	res.json(newPostText);
});

router.delete("/:postId", validateToken, async (req, res) => {
	const postId = req.params.postId;

	await posts.destroy({
		where: {
			id: postId,
		},
	});

	res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
