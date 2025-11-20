const express = require("express");
const Link = require("../models/Link");
const { z } = require("zod");

const router = express.Router();

const shortenSchema = z.object({
    url: z.string().url(),
    customAlias: z.string().optional(),
});

function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

router.post("/shorten", async (req, res) => {
    try {
        const { url, customAlias } = shortenSchema.parse(req.body);
        let shortCode = customAlias || generateShortCode();
        while (await Link.findOne({ shortCode })) {
            shortCode = generateShortCode();
        }
        const link = await Link.create({ originalUrl: url, shortCode });
        res.status(201).json({
            shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid URL or alias already exists" });
    }
});

module.exports = router;
