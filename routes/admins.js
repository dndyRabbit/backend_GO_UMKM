const express = require("express");
const router = express.Router();
const { admins } = require("../models");
const bcrypt = require("bcryptjs");
const { validateToken } = require("../middlewares/authMiddleware");

const { sign } = require("jsonwebtoken");

router.post("/register", async (req, res) => {
	const { username, email, phoneNumber, password } = req.body;
	bcrypt.hash(password, 10).then((hash) => {
		admins.create({
			username,
			email,
			phoneNumber,
			password: hash,
		});
		res.json("REGISTER ADMIN SUCCESS");
	});
});

router.post("/login", async (req, res) => {
	const { usernameOrEmail, password } = req.body;

	const admin = await admins.findOne(
		usernameOrEmail.includes("@")
			? { where: { email: usernameOrEmail } }
			: { where: { username: usernameOrEmail } }
	);

	if (!admin) res.json({ error: "Admin Doesn't exists" });

	bcrypt.compare(password, admin.password).then((match) => {
		if (!match)
			res.json({
				error: "Wrong Username and Password Combination!",
			});

		const accessToken = sign(
			{ username: admin.username, id: admin.id },
			"importantsecret"
		);

		res.json({
			token: accessToken,
			username: usernameOrEmail,
			id: admin.id,
		});
	});
});

module.exports = router;
