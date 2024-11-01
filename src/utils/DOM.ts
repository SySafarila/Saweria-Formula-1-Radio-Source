import queryString from "query-string";
import { startF1Notif } from "..";
import { Queries } from "../types";
import { playOpeningRadio } from "./playSounds";
import { hideRadio } from "./radio";
import { settings } from "./settings";

const parsed = queryString.parse(location.search) as Queries;
const {
  streamKey,
  driverName,
  status,
  teams,
  donationFontSizeInput,
  driverRadioFontSizeInput,
} = parsed;

const startButton: HTMLElement = document.getElementById("startButton");
const audioVisuals = document.querySelectorAll("#audio-visual div");
let intervals: NodeJS.Timeout[] = [];

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

export const donationFontSizeInputListener = () => {
  const input = document.getElementById(
    "donationFontSizeInput"
  ) as HTMLInputElement;
  const donationFrom = document.querySelector("#radio #donation");
  const donationMessage = document.querySelector("#radio #message");

  if (input) {
    input.addEventListener("keyup", (e) => {
      e.preventDefault();

      if (donationFrom) {
        donationFrom.setAttribute("style", `font-size: ${input.value}px;`);
      }
      if (donationMessage) {
        donationMessage.setAttribute("style", `font-size: ${input.value}px;`);
      }
    });
  }

  if (donationFontSizeInput) {
    if (donationFrom) {
      donationFrom.setAttribute(
        "style",
        `font-size: ${donationFontSizeInput}px;`
      );
    }
    if (donationMessage) {
      donationMessage.setAttribute(
        "style",
        `font-size: ${donationFontSizeInput}px;`
      );
    }
  }
};

export const driverRadioFontSizeInputListener = () => {
  const input = document.getElementById(
    "driverRadioFontSizeInput"
  ) as HTMLInputElement;
  const driver = document.querySelector("#radio #driver-name");
  const driverRadio = document.querySelector("#radio #driver-radio");
  const teamConstructors = document.querySelectorAll("#radio #constructor");

  if (input) {
    input.addEventListener("keyup", (e) => {
      e.preventDefault();

      if (driver) {
        driver.setAttribute("style", `font-size: ${input.value}px;`);
      }
      if (driverRadio) {
        driverRadio.setAttribute("style", `font-size: ${input.value}px;`);
      }
      if (teamConstructors) {
        teamConstructors.forEach((teamConstructor) => {
          teamConstructor.setAttribute("style", `height: ${input.value}px;`);
        });
      }
    });
  }

  if (input) {
    if (driver) {
      driver.setAttribute("style", `font-size: ${driverRadioFontSizeInput}px;`);
    }
    if (driverRadio) {
      driverRadio.setAttribute(
        "style",
        `font-size: ${driverRadioFontSizeInput}px;`
      );
    }
    if (teamConstructors) {
      teamConstructors.forEach((teamConstructor) => {
        teamConstructor.setAttribute(
          "style",
          `height: ${driverRadioFontSizeInput}px;`
        );
      });
    }
  }
};

export const openingRadioVolumeListener = () => {
  const input = document.getElementById(
    "openingRadioVolumeInput"
  ) as HTMLInputElement;
  const volumeSelected = document.getElementById("openingRadioVolumeSelected");

  if (input && volumeSelected) {
    input.addEventListener("input", (e) => {
      e.preventDefault();
      volumeSelected.innerText = input.value;
    });
  }
};

export const donationFromVolumeListener = () => {
  const input = document.getElementById(
    "donationFromVolumeInput"
  ) as HTMLInputElement;
  const volumeSelected = document.getElementById("donationFromVolumeSelected");

  if (input && volumeSelected) {
    input.addEventListener("input", (e) => {
      e.preventDefault();
      volumeSelected.innerText = input.value;
    });
  }
};

export const donationMessageVolumeListener = () => {
  const input = document.getElementById(
    "donationMessageVolumeInput"
  ) as HTMLInputElement;
  const volumeSelected = document.getElementById(
    "donationMessageVolumeSelected"
  );

  if (input && volumeSelected) {
    input.addEventListener("input", (e) => {
      e.preventDefault();
      volumeSelected.innerText = input.value;
    });
  }
};

export const startAudioVisual = () => {
  audioVisuals.forEach((el) => {
    const intervalId = setInterval(() => {
      el.setAttribute("style", `height: ${Math.random() * 100}%`);
    }, 150);
    intervals.push(intervalId);
  });
};

export const stopAudioVisual = () => {
  audioVisuals.forEach((el) => {
    el.setAttribute("style", "height: 5%");
  });

  intervals.forEach((interval) => {
    clearInterval(interval);
  });
  intervals = [];
};
