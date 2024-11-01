import queryString from "query-string";
import { Queries } from "./types";
import {
  donationFontSizeInputListener,
  donationFromVolumeListener,
  donationMessageVolumeListener,
  driverNameInputListener,
  driverRadioFontSizeInputListener,
  hideForm,
  hideStartButton,
  openingRadioSoundSampleListener,
  openingRadioVolumeListener,
  startButtonTrigger,
  streamKeyInputListener,
  teamSelector,
  themeSelector,
} from "./utils/DOM";
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

// Driver name input listener
driverNameInputListener();

// streamKey input listener
streamKeyInputListener();

// hide form
hideForm();

// opening radio sound sample listener
openingRadioSoundSampleListener();

// for non-OBS client
startButtonTrigger();

// start team selector
teamSelector();

// font setting
donationFontSizeInputListener();
driverRadioFontSizeInputListener();

// opening radio volume listener
openingRadioVolumeListener();

// donation from volume listener
donationFromVolumeListener();

// donation message volume listener
donationMessageVolumeListener();

if (status && status == "ready") {
  themeSelector();

  // OBS Detector
  const isOBS: boolean = obsDetector();
  if (isOBS) {
    // hideRadio();
    queue.hideRadio();
    hideStartButton();
    startF1Notif();
  }
}
