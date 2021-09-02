import { io } from "socket.io-client/dist/socket.io.js";

var URL = "";
if (window.location.port == "8080" && window.location.hostname == "localhost")
  URL = "http://localhost:3000";
const MAX_CLIENTS = 2000;
const POLLING_PERCENTAGE = 0.0;
const CLIENT_CREATION_INTERVAL_IN_MS = 5;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

const createClient = () => {
  // for demonstration purposes, some clients stay stuck in HTTP long-polling
//   const transports =
    // Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];

const transports = ["websocket"];

  const socket = io(URL, {
    transports,
  });

  setInterval(() => {
    socket.emit("stress-test");
  }, EMIT_INTERVAL_IN_MS);
  
  socket.on("connect_error", (err) => {
      console.log(err.message);
    })

  socket.on("stress-test", () => {
    packetsSinceLastReport++;
  });

  socket.on("disconnect", (reason) => {
    console.log(`disconnect due to ${reason}`);
  });

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (
    packetsSinceLastReport / durationSinceLastReport
  ).toFixed(2);

  console.log(
    `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`
  );

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 1000);
