module.exports = (sequelize, dataTypes) => {
	const comments = sequelize.define("comments", {
		commentBody: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: dataTypes.STRING,
			allowNull: false,
		},
	});
	return comments;
};
