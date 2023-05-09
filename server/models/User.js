const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
