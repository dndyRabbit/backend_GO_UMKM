const express = require("express");
const router = express.Router();
const { posts, likes } = require("../models");
const { validateToken } = require("../middlewares/authMiddleware");

router.post("/", validateToken, async (req, res) => {
	if (!req.file) {
		return res.json({ error: "Path doesnt exists" });
	}

	const post = req.body;
	post.image = req.file.path;
	post.username = req.user.username;
	post.userId = req.user.id;
	await posts.create(post);
	res.json(post);
});

router.get("/", validateToken, async (req, res) => {
	const listOfPosts = await posts.findAll({
		include: [likes],
		where: { status: false },
	});
	const likedPosts = await likes.findAll({
		where: { userId: req.user.id },
	});
	res.json({ listOfPosts, likedPosts });
});

router.get("/ruko", validateToken, async (req, res) => {
	const likedPosts = await likes.findAll({ where: { userId: req.user.id } });
	const listOfPosts = await posts.findAll({
		include: [likes],
		where: { type: "ruko", status: false },
	});
	res.json({ listOfPosts, likedPosts });
});

router.get("/lapak", validateToken, async (req, res) => {
	const likedPosts = await likes.findAll({
		where: { userId: req.user.id },
	});
	const listOfPosts = await posts.findAll({
		include: [likes],
		where: { type: "lapak", status: false },
	});
	res.json({ listOfPosts, likedPosts });
});
router.get("/pujasera", validateToken, async (req, res) => {
	const likedPosts = await likes.findAll({ where: { userId: req.user.id } });
	const listOfPosts = await posts.findAll({
		include: [likes],
		where: { type: "pujasera", status: false },
	});
	res.json({ listOfPosts, likedPosts });
});

router.get("/byId/:id", validateToken, async (req, res) => {
	const id = req.params.id;
	const post = await posts.findByPk(id);
	res.json(post);
});

router.get("/byUserId/:id", validateToken, async (req, res) => {
	const id = req.params.id;
	const listOfPost = await posts.findAll({
		where: { userId: id, status: "false" },
		include: [likes],
	});
	res.json({ listOfPost });
});

router.get("/byUserId/myAds/:id", validateToken, async (req, res) => {
	const id = req.params.id;
	const listOfPost = await posts.findAll({
		where: { userId: id, status: false },
		include: [likes],
	});
	res.json({ listOfPost });
});

router.get("/byUserId/history/:id", validateToken, async (req, res) => {
	const id = req.params.id;
	const listOfPost = await posts.findAll({
		where: { userId: id, status: true },
		include: [likes],
	});
	res.json({ listOfPost });
});

router.put("/update/status", validateToken, async (req, res) => {
	const { status, id } = req.body;
	await posts.update(
		{
			status,
		},
		{ where: { id } }
	);
	res.json(status);
});

router.put("/update", validateToken, async (req, res) => {
	const {
		newTitle,
		newLB,
		newLT,
		newRuangan,
		newLantai,
		newFasilitas,
		newAlamatLengkap,
		newHarga,
		newDescription,
		id,
	} = req.body;
	await posts.update(
		{
			title: newTitle,
			luasBangunan: newLB,
			luasTanah: newLT,
			ruangan: newRuangan,
			lantai: newLantai,
			fasilitas: newFasilitas,
			alamatLengkap: newAlamatLengkap,
			harga: newHarga,
			description: newDescription,
		},
		{ where: { id } }
	);
	res.json({
		newTitle,
		newLB,
		newLT,
		newRuangan,
		newLantai,
		newFasilitas,
		newAlamatLengkap,
		newHarga,
		newDescription,
	});
});

router.delete("/:id", validateToken, async (req, res) => {
	const id = req.params.id;

	await posts.destroy({
		where: {
			id,
		},
	});

	res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
