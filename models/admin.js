module.exports = (sequelize, dataTypes) => {
	const admins = sequelize.define("admins", {
		username: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		email: {
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
	});

	return admins;
};
