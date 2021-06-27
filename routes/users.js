const express = require("express");
const router = express.Router();
const { users, verifies } = require("../models");
const bcrypt = require("bcryptjs");
const { validateToken } = require("../middlewares/authMiddleware");

const { sign } = require("jsonwebtoken");

router.post("/register", async (req, res) => {
	const { username, email, fullName, phoneNumber, password } = req.body;
	if (username.includes("@"))
		return res.json({ error: "cannot input @/.,()|][" });
	if (username.length <= 4) return res.json({ error: "username minimum 5" });

	if (!email.includes("@"))
		return res.json({ error: "email must include '@' " });

	if (!password) res.json({ error: "input your password" });
	if (password.length <= 5) return res.json({ error: "password minimum 5" });

	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		await users.create({
			username,
			email,
			fullName,
			phoneNumber,
			password: hashedPassword,
		});
		res.json("REGISTERED SUCCESS");
	} catch (error) {
		if (error.errors[0].message === "username must be unique") {
			res.json({ error: "Username already Exists!" });
		} else if (error.errors[0].message === "email must be unique") {
			res.json({ error: "Email already is used!" });
		}
	}
});

router.post("/login", async (req, res) => {
	const { usernameOrEmail, password } = req.body;

	const user = await users.findOne(
		usernameOrEmail.includes("@")
			? { where: { email: usernameOrEmail } }
			: { where: { username: usernameOrEmail } }
	);

	if (!user) return res.json({ error: "Username or Password is wrong!" });

	await bcrypt
		.compare(password, user.password)
		.then((match) => {
			if (!match)
				res.json({
					error: "Username or Password is wrong!",
				});

			const accessToken = sign(
				{ username: user.username, id: user.id },
				"importantsecret"
			);

			res.json({
				token: accessToken,
				username: usernameOrEmail,
				id: user.id,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get("/auth", validateToken, async (req, res) => {
	const user = await users.findOne({
		where: { username: req.user.username },
		include: [verifies],
		attributes: { exclude: ["password"] },
	});
	res.json(user);
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
