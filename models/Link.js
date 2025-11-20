const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
    {
        originalUrl: { type: String, required: true },
        shortCode: { type: String, required: true, unique: true },
        customAlias: { type: String, unique: true, sparse: true },
    },
    { timestamps: true }
);

LinkSchema.index({ shortCode: 1 });

module.exports = mongoose.model("Link", LinkSchema);
