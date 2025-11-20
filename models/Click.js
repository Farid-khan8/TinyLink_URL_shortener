const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Link",
        required: true,
    },
    clickedAt: { type: Date, default: Date.now },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
});

module.exports = mongoose.model("Click", ClickSchema);
