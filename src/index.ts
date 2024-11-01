import queryString from "query-string";
import { Queries, Settings } from "./types";
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
import { hideRadio } from "./utils/radio";
import streamKeyParser from "./utils/streamKeyParser";
import { Queue } from "./utils/Queue";

export let socket: WebSocket;

const parsed = queryString.parse(location.search) as Queries;
const {
  streamKey,
  showMessageTime,
  radioVoiceEffectDistortionValue,
  radioVoiceEffect,
  openingRadioSound,
  driverName,
  status,
  teams,
  openingRadioVolume,
  donationFromVolume,
  donationMessageVolume,
} = parsed;

export const settings: Settings = {
  openingRadioSound: openingRadioSound == "on" ? "on" : "off",
  radioVoiceEffect: radioVoiceEffect == "on" ? true : false,
  radioVoiceEffectDistortionValue: radioVoiceEffectDistortionValue ?? 200,
  showMessageTime: showMessageTime ? showMessageTime * 1000 : 5000, // ms
  streamKey: streamKey ? streamKeyParser(streamKey) : "your-stream-key",
  driverName: driverName ?? "Denaldi",
  teams: teams ? teams : "ferrari",
  donationFromVolume: donationFromVolume ? donationFromVolume / 100 : 1,
  donationMessageVolume: donationMessageVolume
    ? donationMessageVolume / 100
    : 1,
  openingRadioVolume: openingRadioVolume ? openingRadioVolume / 100 : 1,
};

export const startF1Notif = () => {
  console.log("Starting F1 Notif");

  socket = new WebSocket(
    `wss://events.saweria.co/stream?streamKey=${settings.streamKey}`
  );

  const queue = Queue;

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
    hideRadio();
    hideStartButton();
    startF1Notif();
  }
}
