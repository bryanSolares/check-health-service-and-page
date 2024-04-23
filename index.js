const axios = require("axios");
const net = require("node:net");
const fs = require("fs/promises");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

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
      resolve({ server: `${host}`, port, status: "success" });
    });

    socket.on("error", (error) => {
      socket.destroy();
      resolve({ server: `${host}`, port, status: error.message });
    });
  });
}

async function writeJSONFile(results) {
  const jsonOutputPath = path.join(__dirname, "results.json");
  await fs.writeFile(jsonOutputPath, JSON.stringify(results, null, 2));
  console.log("Los resultados han sido escritos en results.json");
}

async function writeCSVFile(results) {
  const csvOutputPath = path.join(__dirname, "results.csv");
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

async function main() {
  const listURLs = [
    "http://172.21.200.167:9801/gtw/sendMessage/flow",
    "http://172.21.200.167:8502/",
    "http://172.21.200.167:7001/console/login/LoginForm.jsp",
    "https://avicam.claro.com.gt/avi/",
    "https://torredecontrol.claro.com.gt/",
    "https://torredecontrol.claro.com.gt:9801/gtw/sendMessage/flow",
    "https://jira.claro.com.gt/",
    "https://confluence.claro.com.gt/",
    "https://educlarorg.claro.com.gt/educlaro/",
    "https://processmaker/sysworkflow/es/neoclassic/",
    "https://conciliaciones.claro.com.gt",
    "http://jobpoint.claro.com.gt/",
    "https://jobpoint.claro.com.gt/",
  ];

  const listHosts = [
    "172.21.200.224:7001,8502,8503,22",
    "172.21.200.207:7001,8502,8503,22",
    "172.18.125.62:3871",
    "172.18.125.68:3871",
    "172.18.125.71:3871",
    "172.18.125.64:3871",
    "172.18.125.69:3871",
    "172.18.125.72:3871",
    "172.18.125.65:3871",
    "172.18.125.70:3871",
    "172.18.125.73:3871",
    "172.21.200.59:80,443,22",
    "172.21.200.56:3872,3871,22",
    "172.21.200.243:111,2049,22",
    "172.21.200.144:6112,6113,6114,6115,6116,6117,22",
    "172.21.200.167:8080,8100,8181,9801,7001,7500,22",
    "172.21.200.133:4100,4102,4103,4104,4105,4106,7001,22",
    "10.253.64.57:19092,12181,2888,3888,2370,6005,2369,7005,8393,18080,8443,2368,2371,1521,22",
    "10.253.64.58:19092,12181,2888,3888,2370,6005,2369,7005,8393,18080,8443,2368,2371,1521,22",
    "172.24.136.9:19092,12181,2888,3888,2370,6005,2369,7005,8393,18080,8443,2368,2371,1521,22",
    "172.24.136.10:19092,12181,2888,3888,2370,6005,2369,7005,8393,18080,8443,2368,2371,1521,22",
    "10.253.64.80:3871",
    "10.247.41.150:3875",
    "10.247.41.152:3875",
    "10.218.41.131:8100,8181,9801,22",
    "10.218.41.132:7500,7000,22",
    "172.21.200.237:8100,8181,9801,22",
    "172.21.201.235:3871",
    "172.21.200.244:80,443,3871,25",
  ];

  const websitePromises = listURLs.map(checkWebsite);
  const serverPromises = listHosts.flatMap((host) => {
    const [hostName, portStr] = host.split(":");
    const ports = portStr.split(",").map((p) => parseInt(p.trim()));
    return ports.map((port) => checkServerConnection(hostName, port));
  });

  const results = await Promise.all([...websitePromises, ...serverPromises]);
  await Promise.all([writeJSONFile(results), writeCSVFile(results)]);
}

main();
