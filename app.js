const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const Link = require("./models/Link");
const Click = require("./models/Click");

require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use(express.static("public"));

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

app.get("/:shortCode", async (req, res) => {
    try {
        const link = await Link.findOne({ shortCode: req.params.shortCode });
        if (!link) return res.status(404).send("Short URL not found");
        await Click.create({
            linkId: link._id,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get("User-Agent") || "",
        });
        res.redirect(link.originalUrl);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
