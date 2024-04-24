import axios from "axios";
import net from "node:net";

import fs from "fs/promises";

import { fileURLToPath } from "url";
import path, { dirname, join } from "path";

import { createObjectCsvWriter } from "csv-writer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function checkWebsite(url) {
  const port = url.startsWith("http://") ? 80 : 443;
  try {
    await axios.get(url, { timeout: 20000 });
    return { server: url, port, status: "success" };
  } catch (error) {
    return { server: url, port, status: error.message };
  }
}

function checkServerConnection(host, port) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });

    socket.on("connect", () => {
      socket.end();
      socket.destroy();
      resolve({ server: host, port, status: "success" });
    });

    socket.on("error", (error) => {
      socket.destroy();
      resolve({ server: host, port, status: error.message });
    });
  });
}

async function writeJSONFile(results) {
  const jsonOutputPath = path.join(__dirname, "../../uploads", "results.json");
  await fs.writeFile(jsonOutputPath, JSON.stringify(results, null, 2));
  console.log("Los resultados han sido escritos en results.json");
}

async function writeCSVFile(results) {
  const csvOutputPath = path.join(__dirname, "../../uploads", "results.csv");
  const csvWriter = createObjectCsvWriter({
    path: csvOutputPath,
    header: [
      { id: "server", title: "Server" },
      { id: "port", title: "Port" },
      { id: "status", title: "Status" },
    ],
  });
  const csvData = results.map(({ server, port, status }) => ({ server, port, status }));
  await csvWriter.writeRecords(csvData);
  console.log("Los resultados han sido escritos en results.csv");
}

export { checkWebsite, checkServerConnection, writeCSVFile, writeJSONFile };
