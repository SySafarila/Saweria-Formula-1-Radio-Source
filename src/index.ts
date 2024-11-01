import queryString from "query-string";
import { Queries } from "./types";
import { DomControl } from "./utils/DomClass";
import obsDetector from "./utils/obsDetector";
import { Queue } from "./utils/Queue";
import { settings } from "./utils/settings";

export let socket: WebSocket;

const parsed = queryString.parse(location.search) as Queries;
const { status } = parsed;
const queue = Queue;

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
const dom = DomControl;

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
