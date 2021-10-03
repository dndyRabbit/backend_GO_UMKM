const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const PORT = 3001;

require("dotenv").config();

app.use(express.json());

app.use(cors({ origin: true }));

const db = require("./models");

app.use(
	"/uploads/posts",
	express.static(path.join(__dirname, "uploads/posts"))
);

const imageUploader = require("./helpers/imageUploader");
app.use(imageUploader.upload.single("image"));

//Routers
const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const verifyRouter = require("./routes/verifying");
app.use("/verifies", verifyRouter);

const commentsRouter = require("./routes/comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/users");
app.use("/auth", usersRouter);

const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter);

const adminsRouter = require("./routes/admins");
app.use("/authAdmins", adminsRouter);

const likesRouter = require("./routes/likes");
app.use("/likes", likesRouter);

db.sequelize
	.sync()
	.then(() => {
		app.listen(process.env.PORT || PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
