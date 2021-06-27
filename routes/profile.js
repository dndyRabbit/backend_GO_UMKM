const express = require("express");
const router = express.Router();
const { users, verifies } = require("../models");
const { validateToken } = require("../middlewares/authMiddleware");

router.get("/", validateToken, async (req, res) => {
	const user = await users.findOne({
		where: { username: req.user.username },
		include: [verifies],
		attributes: { exclude: ["password"] },
	});
	res.json(user);
});

router.put("/editProfile", validateToken, async (req, res) => {
	const { fullName, phoneNumber } = req.body;
	if (!fullName || !phoneNumber) {
		return res.json({ error: "Input your name or number first" });
	}
	if (fullName.length <= 4)
		return res.json({ error: "Fullname minimum 4 character" });
	if (phoneNumber.length >= 13)
		return res.json({ error: "Number maximum 13 character" });
	if (phoneNumber.length <= 5) res.json({ error: "Number is too short" });
	// const user = await users.findOne({
	// 	where: { id },
	// });
	await users.update(
		{ fullName, phoneNumber },
		{ where: { username: req.user.username } }
	);
	res.json("Update Successfully!");
});

module.exports = router;
