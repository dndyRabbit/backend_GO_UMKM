const express = require("express");
const router = express.Router();
const { likes } = require("../models");
const { validateToken } = require("../middlewares/authMiddleware");

router.post("/", validateToken, async (req, res) => {
	const { postId } = req.body;
	const userId = req.user.id;

	const found = await likes.findOne({ where: { postId, userId } });

	if (!found) {
		await likes.create({ postId, userId });
		res.json({ liked: true });
	} else {
		await likes.destroy({
			where: { postId, userId },
		});
		res.json({ liked: false });
	}

	res.json("Success");
});

module.exports = router;
