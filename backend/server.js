const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const converter = require("libreoffice-convert");
const natural = require("natural");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

converter.convertAsync = require('util').promisify(libre.convert);

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("pptx"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    try {
        const filePath = req.file.path;
        const slidesText = await extractTextFromPPTX(filePath);
        const keywords = extractKeywords(slidesText);
        const definitions = await fetchDefinitions(keywords);
        
        fs.unlinkSync(filePath); // Clean up uploaded file

        res.json({ slidesText, keywords, definitions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error processing PowerPoint" });
    }
});

async function extractTextFromPPTX(filePath) {
    const pptx = new PPTXParser();
    await pptx.load(filePath);
    return pptx.getRawText();
}

function extractKeywords(text) {
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text.toLowerCase());
    const tfidf = new natural.TfIdf();

    tfidf.addDocument(words.join(" "));
    const keywords = [];
    tfidf.listTerms(0).slice(0, 10).forEach(term => keywords.push(term.term));

    return keywords;
}

async function fetchDefinitions(keywords) {
    const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    const definitions = {};

    for (const word of keywords) {
        try {
            const response = await axios.get(`${dictionaryAPI}${word}`);
            definitions[word] = response.data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";
        } catch (error) {
            definitions[word] = "Definition not found.";
        }
    }

    return definitions;
}

app.listen(port, () => console.log(`Server running on port ${port}`));
