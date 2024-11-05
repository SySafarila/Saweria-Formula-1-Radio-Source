import queryString from "query-string";
import { Queries } from "./types";
import Dom from "./utils/Dom";
import SaweriaQueue from "./utils/Queue";
import SettingClass from "./utils/Setting";
import Sound from "./utils/Sound";

const parsed = queryString.parse(location.search) as Queries;
const { status } = parsed;
const setting = new SettingClass();
export const sound = new Sound(setting);
export const queue = new SaweriaQueue(setting);
export const dom = new Dom(setting);
export let socket: WebSocket;

export const startF1Notif = () => {
  console.log("Starting F1 Notif");

  socket = new WebSocket(
    `wss://events.saweria.co/stream?streamKey=${setting.streamKey}`
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
  // OBS Detector
  // const isOBS: boolean = dom.obsDetector();
  // if (isOBS) {
  // }
  dom.hideRadio();
  dom.hideStartButton();
  startF1Notif();
}
