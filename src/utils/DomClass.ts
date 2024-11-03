import queryString from "query-string";
import { sound, startF1Notif } from "..";
import { Queries } from "../types";
import SettingClass from "./SettingClass";

const parsed = queryString.parse(location.search) as Queries;
const {
  streamKey,
  driverName,
  status,
  teams,
  donationFontSizeInput,
  driverRadioFontSizeInput,
  openingRadioVolume,
  donationFromVolume,
  donationMessageVolume,
  showMessageTime,
  openingRadioSound,
  radioVoiceEffect,
} = parsed;

export default class Dom {
  private intervals: NodeJS.Timeout[] = [];
  private setting: SettingClass;

  constructor(setting: SettingClass) {
    this.setting = setting;
    this.driverNameInputListener();
    this.streamKeyInputListener();
    this.hideForm();
    this.openingRadioSoundSampleListener();
    this.startButtonTrigger();
    this.teamSelector();
    this.donationFontSizeInputListener();
    this.driverRadioFontSizeInputListener();
    this.openingRadioVolumeListener();
    this.donationFromVolumeListener();
    this.donationMessageVolumeListener();
    this.setMessageShowTime();
    this.setDonationFontSize();
    this.setDriverRadioFontSize();
    this.setTeam();
    this.setOpeningRadioSound();
    this.setRadioVoiceEffect();
    this.themeSelector();
    this.playSampleDonation();
  }

  private playSampleDonation() {
    const button = document.getElementById("playsampleDonation");
    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        sound.playExampleDonation();
      });
    }
  }

  private setMessageShowTime() {
    const input = document.getElementById(
      "showMessageTime"
    ) as HTMLInputElement;

    if (input && status && status === "ready" && showMessageTime) {
      input.value = showMessageTime.toString();
    }
  }

  private setDonationFontSize() {
    const input = document.getElementById(
      "donationFontSizeInput"
    ) as HTMLInputElement;

    if (input && status && status === "ready" && donationFontSizeInput) {
      input.value = donationFontSizeInput.toString();
    }
  }

  private setDriverRadioFontSize() {
    const input = document.getElementById(
      "driverRadioFontSizeInput"
    ) as HTMLInputElement;

    if (input && status && status === "ready" && driverRadioFontSizeInput) {
      input.value = driverRadioFontSizeInput.toString();
    }
  }

  private setTeam() {
    const input = document.getElementById("teams") as HTMLInputElement;

    if (input && status && status === "ready" && teams) {
      input.value = teams;
    }
  }

  private setOpeningRadioSound() {
    const inputOn = document.getElementById(
      "openingRadioSoundInputOn"
    ) as HTMLInputElement;
    const inputOff = document.getElementById(
      "openingRadioSoundInputOff"
    ) as HTMLInputElement;

    if (status && status === "ready") {
      if (openingRadioSound === "on" && inputOn) {
        inputOn.checked = true;
      }
      if (openingRadioSound === "off" && inputOff) {
        inputOff.checked = true;
      }
    }
  }

  private setRadioVoiceEffect() {
    const inputOn = document.getElementById(
      "radioEffectOn"
    ) as HTMLInputElement;
    const inputOff = document.getElementById(
      "radioEffectOff"
    ) as HTMLInputElement;

    if (status && status === "ready") {
      if (radioVoiceEffect === "on" && inputOn) {
        inputOn.checked = true;
      }
      if (radioVoiceEffect === "off" && inputOff) {
        inputOff.checked = true;
      }
    }
  }

  obsDetector(): boolean {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("OBS")) {
      return true;
    }
    return false;
  }

  hideStartButton() {
    const startButton: HTMLElement = document.getElementById("startButton");
    if (startButton && startButton.classList.contains("hidden") == false) {
      startButton.classList.add("hidden");
    }
  }

  private startButtonTrigger() {
    const startButton: HTMLElement = document.getElementById("startButton");
    if (!status) {
      this.hideStartButton();
    }

    if (startButton) {
      startButton.addEventListener("click", (e) => {
        e.preventDefault();
        startF1Notif();
        this.hideRadio();
        this.hideStartButton();
      });
    }
  }

  hideRadio() {
    const radioEl = document.getElementById("radio");
    if (radioEl && !radioEl.classList.contains("hidden")) {
      radioEl.classList.add("hidden");
    }
  }

  private teamSelector() {
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
  }

  private themeSelector() {
    const radioEl = document.getElementById("radio");

    if (radioEl) {
      radioEl.classList.forEach((className) => {
        radioEl.classList.remove(className);
      });

      radioEl.classList.add(teams ?? "ferrari");
    }
  }

  private driverNameInputListener() {
    const driverNameInput = document.getElementById(
      "driverNameInput"
    ) as HTMLInputElement;
    const driverNameEl: HTMLElement = document.getElementById("driver-name");

    if (driverNameInput) {
      driverNameInput.addEventListener("input", (e) => {
        e.preventDefault();

        if (driverNameEl) {
          driverNameEl.innerText = driverNameInput.value;
        }
      });
    }

    if (driverNameEl) {
      driverNameEl.innerText = this.setting.driverName ?? "Denaldi";
    }

    if (driverName && driverNameInput) {
      driverNameInput.value = this.setting.driverName ?? "Denaldi";
    }
  }

  private streamKeyInputListener() {
    const streamKeyInput = document.getElementById(
      "streamKeyInput"
    ) as HTMLInputElement;

    if (streamKeyInput && streamKey) {
      streamKeyInput.value = streamKey;
    }
  }

  private hideForm() {
    const formSetting = document.getElementById("formSetting");
    if (
      formSetting &&
      status == "ready" &&
      formSetting.classList.contains("hidden") == false
    ) {
      formSetting.classList.add("hidden");
    }
  }

  private openingRadioSoundSampleListener() {
    const openingRadioSoundExample = document.getElementById(
      "openingRadioSoundExample"
    );
    if (openingRadioSoundExample) {
      openingRadioSoundExample.addEventListener("click", (e) => {
        e.preventDefault();
        sound.playOpeningRadio();
      });
    }
  }

  private donationFontSizeInputListener() {
    const input = document.getElementById(
      "donationFontSizeInput"
    ) as HTMLInputElement;
    const donationFrom = document.querySelector("#radio #donation");
    const donationMessage = document.querySelector("#radio #message");

    if (input) {
      input.addEventListener("input", (e) => {
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
  }

  private driverRadioFontSizeInputListener() {
    const input = document.getElementById(
      "driverRadioFontSizeInput"
    ) as HTMLInputElement;
    const driver = document.querySelector("#radio #driver-name");
    const driverRadio = document.querySelector("#radio #driver-radio");
    const teamConstructors = document.querySelectorAll("#radio #constructor");

    if (input) {
      input.addEventListener("input", (e) => {
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
        driver.setAttribute(
          "style",
          `font-size: ${driverRadioFontSizeInput}px;`
        );
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
  }

  private openingRadioVolumeListener() {
    const input = document.getElementById(
      "openingRadioVolumeInput"
    ) as HTMLInputElement;
    const volumeSelected = document.getElementById(
      "openingRadioVolumeSelected"
    );

    if (input && volumeSelected) {
      input.addEventListener("input", (e) => {
        e.preventDefault();
        volumeSelected.innerText = input.value;
      });
    }

    if (status && status === "ready") {
      input.value = openingRadioVolume.toString();
      volumeSelected.innerText = openingRadioVolume.toString();
    }
  }

  private donationFromVolumeListener() {
    const input = document.getElementById(
      "donationFromVolumeInput"
    ) as HTMLInputElement;
    const volumeSelected = document.getElementById(
      "donationFromVolumeSelected"
    );

    if (input && volumeSelected) {
      input.addEventListener("input", (e) => {
        e.preventDefault();
        volumeSelected.innerText = input.value;
      });
    }

    if (status && status === "ready") {
      input.value = donationFromVolume.toString();
      volumeSelected.innerText = donationFromVolume.toString();
    }
  }

  private donationMessageVolumeListener() {
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
        this.setting.donationMessageVolume = parseInt(input.value) / 100;
      });
    }

    if (status && status === "ready") {
      input.value = donationMessageVolume.toString();
      volumeSelected.innerText = donationMessageVolume.toString();
    }
  }

  startAudioVisual() {
    const audioVisuals: NodeListOf<Element> =
      document.querySelectorAll("#audio-visual div");

    audioVisuals.forEach((el) => {
      const intervalId = setInterval(() => {
        el.setAttribute("style", `height: ${Math.random() * 100}%`);
      }, 150);
      this.intervals.push(intervalId);
    });
  }

  stopAudioVisual() {
    const audioVisuals: NodeListOf<Element> =
      document.querySelectorAll("#audio-visual div");

    audioVisuals.forEach((el) => {
      el.setAttribute("style", "height: 5%");
    });

    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals = [];
  }
}
