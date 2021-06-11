const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		token: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			default: Date.now,
			index: { expires: 86400000 },
		},
	},
	{
		timestamps: true,
	}
);

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
