import express from "express";
import multer from "multer";
import morgan from "morgan";

import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import fs from "node:fs/promises";

import { checkWebsite, checkServerConnection } from "./utils/utils.js";
import { writeCSVFile, writeJSONFile } from "./utils/utils.js";

const upload = multer({ dest: "uploads/" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

app.get("/", (_, res) => {
  const filePath = join(__dirname, "public", "index.html");
  res.sendFile(filePath);
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileContent = await fs.readFile(filePath, "utf-8");
    const lines = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const websitePromises = [];
    const serverPromises = [];

    lines.forEach((line) => {
      if (line.startsWith("http")) {
        websitePromises.push(checkWebsite(line));
      } else {
        const [host, ports] = line.split(":");
        const portArr = ports.split(",").map((port) => parseInt(port.trim()));
        portArr.forEach((port) => serverPromises.push(checkServerConnection(host, port)));
      }
    });

    const results = await Promise.all([...websitePromises, ...serverPromises]);
    await writeJSONFile(results);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/export-csv", async (req, res) => {
  try {
    const resultsFilePath = join(__dirname, "../uploads", "results.json");
    const csvOutputPath = join(__dirname, "../uploads", "results.csv");

    // Leer los resultados del archivo JSON
    const results = await fs.readFile(resultsFilePath, "utf-8");
    const jsonData = JSON.parse(results);

    await writeCSVFile(jsonData);

    // Descargar el archivo CSV
    res.download(csvOutputPath, "../uploads/results.csv");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
