import queryString from "query-string";
import { settings, startF1Notif } from "..";
import { Queries } from "../types";
import { playOpeningRadio } from "./playSounds";
import { hideRadio } from "./radio";

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

const startButton: HTMLElement = document.getElementById("startButton");

export const hideStartButton = () => {
  if (startButton && startButton.classList.contains("hidden") == false) {
    startButton.classList.add("hidden");
  }
};

export const startButtonTrigger = () => {
  if (!status) {
    hideStartButton();
  }

  if (startButton) {
    startButton.addEventListener("click", (e) => {
      e.preventDefault();
      startF1Notif();
      hideRadio();
      hideStartButton();
    });
  }
};

export const teamSelector = () => {
  const teamSelectorEl = document.getElementById("teams") as HTMLInputElement;

  if (teamSelectorEl) {
    teamSelectorEl.addEventListener("change", (e) => {
      e.preventDefault();
      const radioEl = document.getElementById("radio");
      if (radioEl) {
        radioEl.classList.forEach((className) => {
          radioEl.classList.remove(className);
        });

        radioEl.classList.add(teamSelectorEl.value);
      }
    });
  }
};

export const themeSelector = () => {
  const radioEl = document.getElementById("radio");

  if (radioEl) {
    radioEl.classList.forEach((className) => {
      radioEl.classList.remove(className);
    });

    radioEl.classList.add(teams);
  }
};

export const driverNameInputListener = () => {
  const driverNameInput = document.getElementById(
    "driverNameInput"
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
};

export const streamKeyInputListener = () => {
  const streamKeyInput = document.getElementById(
    "streamKeyInput"
  ) as HTMLInputElement;

  if (streamKeyInput && streamKey) {
    streamKeyInput.value = settings.streamKey;
  }
};

export const hideForm = () => {
  const formSetting = document.getElementById("formSetting");
  if (
    formSetting &&
    status == "ready" &&
    formSetting.classList.contains("hidden") == false
  ) {
    formSetting.classList.add("hidden");
  }
};

export const openingRadioSoundSampleListener = () => {
  const openingRadioSoundExample = document.getElementById(
    "openingRadioSoundExample"
  );
  if (openingRadioSoundExample) {
    openingRadioSoundExample.addEventListener("click", (e) => {
      e.preventDefault();
      playOpeningRadio();
    });
  }
};
