import queryString from "query-string";
import { Queries, SaweriaDonation, Settings } from "./types";
import { startAudioVisual, stopAudioVisual } from "./utils/audioVisual";
import startDelay from "./utils/delay";
import obsDetector from "./utils/obsDetector";
import {
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
} = parsed;

export const settings: Settings = {
  openingRadioSound: openingRadioSound == "on" ? "on" : "off",
  radioVoiceEffect: radioVoiceEffect == "on" ? true : false,
  radioVoiceEffectDistortionValue: radioVoiceEffectDistortionValue ?? 200,
  showMessageTime: showMessageTime ? showMessageTime * 1000 : 5000, // ms
  streamKey: streamKey ? streamKeyParser(streamKey) : "your-stream-key",
  driverName: driverName ?? "Denaldi",
  teams: teams ? teams : "ferrari",
};

const deletePlayedQueue = (): void => {
  if (queues.length >= 1) {
    isPlaying = false;
    queues.splice(0, 1);
  }
};

export const startQueue = async () => {
  isPlaying = true;

  const tts = queues[0].tts;

  showRadio(queues[0]);

  if (tts) {
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
    startAudioVisual();
    if (settings.openingRadioSound == "on") {
      await playOpeningRadio();
    }
    await startDelay(settings.showMessageTime);
    stopAudioVisual();
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

const driverNameInput = document.getElementById(
  "driverNameInput"
) as HTMLInputElement;
const streamKeyInput = document.getElementById(
  "streamKeyInput"
) as HTMLInputElement;
const driverNameEl: HTMLElement = document.getElementById("driver-name");

if (driverNameInput) {
  driverNameInput.addEventListener("keyup", (e) => {
    e.preventDefault();

    if (driverNameEl) {
      driverNameEl.innerText = driverNameInput.value;
    }
  });
}

if (driverNameEl) {
  driverNameEl.innerText = settings.driverName ?? "Denaldi";
}
if (driverName && driverNameInput) {
  driverNameInput.value = settings.driverName ?? "Denaldi";
}
if (streamKeyInput && streamKey) {
  streamKeyInput.value = settings.streamKey;
}
const formSetting = document.getElementById("formSetting");
if (
  formSetting &&
  status == "ready" &&
  formSetting.classList.contains("hidden") == false
) {
  formSetting.classList.add("hidden");
}

const openingRadioSoundExample = document.getElementById(
  "openingRadioSoundExample"
);
if (openingRadioSoundExample) {
  openingRadioSoundExample.addEventListener("click", (e) => {
    e.preventDefault();
    playOpeningRadio();
  });
}

const startButton: HTMLElement = document.getElementById("startButton");
if (startButton) {
  if (status != "ready") {
    if (startButton.classList.contains("hidden") == false) {
      startButton.classList.add("hidden");
    }
  }
  startButton.addEventListener("click", (e) => {
    const radioEl = document.getElementById("radio");
    e.preventDefault();
    startF1Notif();
    if (radioEl && !radioEl.classList.contains("hidden")) {
      radioEl.classList.add("hidden");
    }
    startButton.classList.add("hidden");
  });
}

const teamSelector = document.getElementById("teams") as HTMLInputElement;
if (teamSelector) {
  teamSelector.addEventListener("change", (e) => {
    e.preventDefault();
    const radioEl = document.getElementById("radio");
    if (radioEl) {
      radioEl.classList.forEach((className) => {
        radioEl.classList.remove(className);
      });
      radioEl.classList.add(teamSelector.value);
    }
    console.log(teamSelector.value);
  });
}

if (status && status == "ready") {
  const setTheme = () => {
    const radioEl = document.getElementById("radio");
    if (radioEl) {
      radioEl.classList.forEach((className) => {
        radioEl.classList.remove(className);
      });
      radioEl.classList.add(teams);
    }
  };
  setTheme();

  const isOBS: boolean = obsDetector();
  if (isOBS) {
    hideRadio();
    if (startButton && startButton.classList.contains("hidden") == false) {
      startButton.classList.add("hidden");
    }
    startF1Notif();
  }
}
