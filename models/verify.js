module.exports = (sequelize, dataTypes) => {
	const verifies = sequelize.define("verifies", {
		image: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		fullName: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: dataTypes.STRING(15),
			allowNull: false,
		},
	});

	return verifies;
};
