module.exports = (sequelize, dataTypes) => {
	const users = sequelize.define("users", {
		username: {
			type: dataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: dataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		fullName: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		phoneNumber: {
			type: dataTypes.INTEGER(13),
			allowNull: false,
		},
		password: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: dataTypes.STRING,
		},
	});

	users.associate = (models) => {
		users.hasMany(models.likes, {
			onDelete: "cascade",
		});

		users.hasMany(models.posts, {
			onDelete: "cascade",
		});

		users.hasMany(models.verifies, {
			onDelete: "cascade",
		});
	};

	return users;
};
