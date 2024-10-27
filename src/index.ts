import queryString from "query-string";
import { Queries, SaweriaDonation, Settings } from "./types";
import { startAudioVisual, stopAudioVisual } from "./utils/audioVisual";
import startDelay from "./utils/delay";
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
import {
  playCashRegister,
  playCustomSaweriaNotif,
  playOpeningRadio,
  playTtsFrom,
  playTtsMessage,
} from "./utils/playSounds";
import { hideRadio, showRadio } from "./utils/radio";
import {
  socketCloseHandler,
  socketMessageHandler,
  socketOpenHandler,
} from "./utils/sockerHandlers";
import streamKeyParser from "./utils/streamKeyParser";

export let isPlaying: boolean = false;
export let socket: WebSocket;
export const queues: SaweriaDonation[] = [];

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

const deletePlayedQueue = (): void => {
  if (queues.length >= 1) {
    isPlaying = false;
    queues.splice(0, 1);
  }
};

export const startQueue = async () => {
  isPlaying = true;

  let customSaweriaNotifUrl: string | undefined = undefined;
  const customSaweriaNotifObject = queues[0].sound;
  if (
    customSaweriaNotifObject &&
    typeof customSaweriaNotifObject === "object"
  ) {
    const soundKeys = Object.keys(customSaweriaNotifObject);
    soundKeys.forEach((key) => {
      const soundUrl: string = customSaweriaNotifObject[key];
      customSaweriaNotifUrl = soundUrl;
    });
  }

  const tts = queues[0].tts;

  showRadio(queues[0]);

  if (tts) {
    if (customSaweriaNotifUrl) {
      await playCustomSaweriaNotif(customSaweriaNotifUrl);
    } else {
      await playCashRegister();
    }

    await playTtsFrom(`data:audio/wav;base64,${tts[0]}`);
    startAudioVisual();

    if (settings.openingRadioSound == "on") {
      await playOpeningRadio();
    }

    await playTtsMessage(`data:audio/wav;base64,${tts[1]}`);
    stopAudioVisual();
    await startDelay(settings.showMessageTime);
    hideRadio();
    await startDelay(1000); // delay 1 detik
  } else {
    if (customSaweriaNotifUrl) {
      await playCustomSaweriaNotif(customSaweriaNotifUrl);
    } else {
      await playCashRegister();
    }

    startAudioVisual();

    if (settings.openingRadioSound == "on") {
      await playOpeningRadio();
    }

    await startDelay(settings.showMessageTime);
    stopAudioVisual();
    await startDelay(1000); // delay 1 detik
    hideRadio();
    await startDelay(1000); // delay 1 detik
  }

  deletePlayedQueue();
  if (queues.length >= 1) {
    startQueue();
  }
};

export const startF1Notif = () => {
  console.log("Starting F1 Notif");

  socket = new WebSocket(
    `wss://events.saweria.co/stream?streamKey=${settings.streamKey}`
  );

  socket.addEventListener("open", socketOpenHandler, {
    once: true,
  });
  socket.addEventListener("message", socketMessageHandler);
  socket.addEventListener("close", socketCloseHandler, {
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
