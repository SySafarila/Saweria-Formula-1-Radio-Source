import queryString from "query-string";
import { Queries } from "./types";
import Dom from "./utils/DomClass";
import obsDetector from "./utils/obsDetector";
import SaweriaQueue from "./utils/Queue";
import { settings } from "./utils/settings";

const parsed = queryString.parse(location.search) as Queries;
const { status } = parsed;
const queue = new SaweriaQueue();
export const dom = new Dom();
export let socket: WebSocket;

export const startF1Notif = () => {
  console.log("Starting F1 Notif");

  socket = new WebSocket(
    `wss://events.saweria.co/stream?streamKey=${settings.streamKey}`
  );

  socket.addEventListener("open", queue.onOpen, {
    once: true,
  });
  socket.addEventListener("message", queue.onMessage);
  socket.addEventListener("close", queue.onClose, {
    once: true,
  });
};

// DOM

if (status && status == "ready") {
  dom.themeSelector();

  // OBS Detector
  const isOBS: boolean = obsDetector();
  if (isOBS) {
    dom.hideRadio();
    dom.hideStartButton();
    startF1Notif();
  }
}
