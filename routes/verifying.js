const express = require("express");
const router = express.Router();
const { verifies } = require("../models");
const { validateToken } = require("../middlewares/authMiddleware");

router.post("/", validateToken, async (req, res) => {
	if (!req.file) {
		res.json({ error: "Path doesnt exists" });
	}

	const verif = req.body;
	verif.image = req.file.path;
	verif.userId = req.user.id;
	await verifies.create(verif);
	res.json(verif);
});

router.put("/updateStatus", async (req, res) => {
	const { status, id } = req.body;
	await verifies.update(
		{
			status,
		},
		{ where: { id } }
	);
	res.json(status);
});
router.get("/", async (req, res) => {
	const listOfUser = await verifies.findAll();

	res.json(listOfUser);
});

module.exports = router;
