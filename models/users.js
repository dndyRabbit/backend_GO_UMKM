module.exports = (sequelize, dataTypes) => {
	const users = sequelize.define("users", {
		username: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: dataTypes.STRING,
			allowNull: false,
		},
	});

	users.associate = (models) => {
		users.hasMany(models.likes, {
			onDelete: "cascade",
		});

		users.hasMany(models.posts, {
			onDelete: "cascade",
		});
	};

	return users;
};
