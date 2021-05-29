const express = require("express");
const router = express.Router();
const { users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/authMiddleware");

const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
	const { username, password } = req.body;
	bcrypt.hash(password, 10).then((hash) => {
		users.create({
			username,
			password: hash,
		});
		res.json("HASHED SUCCESS");
	});
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	const user = await users.findOne({ where: { username } });

	if (!user) res.json({ error: "user Doesn't exists" });

	bcrypt.compare(password, user.password).then((match) => {
		if (!match)
			res.json({
				error: "Wrong Username and Password Combination!",
			});

		const accessToken = sign(
			{ username: user.username, id: user.id },
			"importantsecret"
		);

		res.json({ token: accessToken, username: username, id: user.id });
	});
});

router.get("/auth", validateToken, (req, res) => {
	res.json(req.user);
});

router.get("/basicInfo/:id", async (req, res) => {
	const id = req.params.id;

	const basicInfo = await users.findByPk(id, {
		attributes: { exclude: ["password"] },
	});
	res.json(basicInfo);
});

router.put("/changePassword", validateToken, async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	const user = await users.findOne({
		where: { username: req.user.username },
	});

	bcrypt.compare(oldPassword, user.password).then((match) => {
		if (!match) res.json({ error: "Wrong Password Entered!" });

		bcrypt.hash(newPassword, 10).then((hash) => {
			users.update(
				{ password: hash },
				{ where: { username: req.user.username } }
			);
			res.json("HASHED SUCCESS");
		});
	});
});

module.exports = router;
