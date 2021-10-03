module.exports = (sequelize, dataTypes) => {
	const posts = sequelize.define("posts", {
		type: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		title: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		luasBangunan: {
			type: dataTypes.INTEGER,
			allowNull: false,
		},
		luasTanah: {
			type: dataTypes.INTEGER,
			allowNull: false,
		},
		fasilitas: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		alamatLengkap: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		harga: {
			type: dataTypes.INTEGER,
			allowNull: false,
		},
		description: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		fullName: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		phoneNumber: {
			type: dataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: dataTypes.BOOLEAN,
			allowNull: false,
		},
	});

	posts.associate = (models) => {
		posts.hasMany(models.comments, {
			onDelete: "cascade",
		});

		posts.hasMany(models.likes, {
			onDelete: "cascade",
		});
	};

	return posts;
};
