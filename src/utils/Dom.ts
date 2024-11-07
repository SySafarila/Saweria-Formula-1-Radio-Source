import queryString from "query-string";
import { queue, setting, sound, startF1Notif } from "..";
import { Queries } from "../types";

const query = queryString.parse(location.search) as Queries;

export default class Dom {
  private intervals: NodeJS.Timeout[] = [];

  constructor() {
    // other
    this.hideForm();
    this.startButtonTrigger();
    this.playSampleDonation();
    this.playIncomingRadio();
    this.editMode();

    // html input listeners
    this.inputListeners();

    // apply from current setting
    this.applyCurrentSettings();
  }

  private inputListeners() {
    this.donateFromVolumeListener();
    this.donateMessageVolumeListener();
    this.driverNameInputListener();
    this.distortionInputListener();
    this.radioVoiceEffectListener();
    this.incomingRadioListener();
    this.donateDurationListener();
    this.teamSelectorListener();
    this.donateFontSizeListener();
    this.RadioFontSizeListener();
    this.incomingRadioVolumeListener();
  }

  private applyCurrentSettings() {
    this.setDonateFromVolume();
    this.setDonateMessageVolume();
    this.setOpeningRadioVolume();
    this.setDistortionInput();
    this.setDonateDurationInput();
    this.setDonateFontSizeInput();
    this.setTeam();
    this.setRadioVoiceEffect();
    this.setRadioFontSize();
    this.setIncomingRadio();
    this.setTeamRadio();
    this.setDriverName();
    this.setDonationFontSize();
    this.setDriverRadioFontSize();
    this.setStreamKey();
  }

  private editMode() {
    if (setting.status === "ready") {
      const formSetting = document.getElementById("formSetting");

      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "E") {
          e.preventDefault();
          if (formSetting) {
            formSetting.classList.toggle("hidden");
          }
        }
      });
    }
  }

  private radioVoiceEffectListener() {
    const inputOn = document.getElementById(
      "radioEffectOn"
    ) as HTMLInputElement;
    const inputOff = document.getElementById(
      "radioEffectOff"
    ) as HTMLInputElement;

    if (inputOn) {
      inputOn.addEventListener("input", (e) => {
        setting.radioVoiceEffect = true;
      });
    }

    if (inputOff) {
      inputOff.addEventListener("input", (e) => {
        setting.radioVoiceEffect = false;
      });
    }
  }

  private incomingRadioListener() {
    const inputOn = document.getElementById(
      "openingRadioSoundInputOn"
    ) as HTMLInputElement;
    const inputOff = document.getElementById(
      "openingRadioSoundInputOff"
    ) as HTMLInputElement;

    if (inputOn) {
      inputOn.addEventListener("input", (e) => {
        setting.incomingRadio = true;
      });
    }

    if (inputOff) {
      inputOff.addEventListener("input", (e) => {
        setting.incomingRadio = false;
      });
    }
  }

  private playSampleDonation() {
    const button = document.getElementById("playsampleDonation");
    if (button) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        queue.addExampleDonate();
      });
    }
  }

  private donateDurationListener() {
    const input = document.getElementById(
      "showMessageTime"
    ) as HTMLInputElement;

    if (input) {
      input.addEventListener("input", (e) => {
        setting.donateDuration = parseInt(input.value) * 1000;
      });
    }
  }

  private setDonateDurationInput() {
    const input = document.getElementById(
      "showMessageTime"
    ) as HTMLInputElement;

    if (input && setting.status === "ready" && setting.donateDuration) {
      input.value = (setting.donateDuration / 1000).toString();
    }
  }

  private setDonateFontSizeInput() {
    const input = document.getElementById(
      "donationFontSizeInput"
    ) as HTMLInputElement;

    if (input && setting.status === "ready" && setting.donateFontSize) {
      input.value = setting.donateFontSize.toString();
    }
  }

  private setRadioFontSize() {
    const input = document.getElementById(
      "driverRadioFontSizeInput"
    ) as HTMLInputElement;

    if (input && setting.status === "ready" && setting.radioFontSize) {
      input.value = setting.radioFontSize.toString();
    }
  }

  private setTeam() {
    const input = document.getElementById("teams") as HTMLInputElement;

    if (input && setting.status === "ready" && setting.team) {
      input.value = setting.team;
    }
  }

  private setIncomingRadio() {
    const inputOn = document.getElementById(
      "openingRadioSoundInputOn"
    ) as HTMLInputElement;
    const inputOff = document.getElementById(
      "openingRadioSoundInputOff"
    ) as HTMLInputElement;

    if (setting.status === "ready") {
      if (setting.incomingRadio === true && inputOn) {
        inputOn.checked = true;
      }
      if (setting.incomingRadio === false && inputOff) {
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

    if (setting.status === "ready") {
      if (setting.radioVoiceEffect === true && inputOn) {
        inputOn.checked = true;
      }
      if (setting.radioVoiceEffect === false && inputOff) {
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
    if (!setting.status) {
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

  private teamSelectorListener() {
    const teamSelectorEl = document.getElementById("teams") as HTMLInputElement;
    const radioEl = document.getElementById("radio");

    if (teamSelectorEl) {
      teamSelectorEl.addEventListener("change", (e) => {
        e.preventDefault();
        if (radioEl) {
          radioEl.classList.forEach((className) => {
            radioEl.classList.remove(className);
          });

          radioEl.classList.add(teamSelectorEl.value);
        }
      });
    }
  }

  private setTeamRadio() {
    const radioEl = document.getElementById("radio");

    if (radioEl && setting.status === "ready") {
      radioEl.classList.forEach((className) => {
        radioEl.classList.remove(className);
      });

      radioEl.classList.add(setting.team ?? "ferrari");
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
  }

  private setDriverName() {
    const driverNameInput = document.getElementById(
      "driverNameInput"
    ) as HTMLInputElement;
    const driverNameEl: HTMLElement = document.getElementById("driver-name");

    if (setting.driverName) {
      driverNameInput.value = setting.driverName;
      driverNameEl.innerText = setting.driverName;
    }
  }

  private setStreamKey() {
    const streamKeyInput = document.getElementById(
      "streamKeyInput"
    ) as HTMLInputElement;

    if (streamKeyInput && setting.streamKey && setting.status === "ready") {
      streamKeyInput.value = query.streamKey;
    }
  }

  private hideForm() {
    const formSetting = document.getElementById("formSetting");
    if (
      formSetting &&
      setting.status == "ready" &&
      formSetting.classList.contains("hidden") == false
    ) {
      formSetting.classList.add("hidden");
    }
  }

  private playIncomingRadio() {
    const openingRadioSoundExample = document.getElementById(
      "openingRadioSoundExample"
    );
    if (openingRadioSoundExample) {
      openingRadioSoundExample.addEventListener("click", (e) => {
        e.preventDefault();
        sound.playIncomingRadio();
      });
    }
  }

  private donateFontSizeListener() {
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
  }

  private setDonationFontSize() {
    const donationFrom: HTMLElement =
      document.querySelector("#radio #donation");
    const donationMessage: HTMLElement =
      document.querySelector("#radio #message");

    if (setting.donateFontSize) {
      if (donationFrom) {
        donationFrom.setAttribute(
          "style",
          `font-size: ${setting.donateFontSize}px`
        );
      }
      if (donationMessage) {
        donationMessage.setAttribute(
          "style",
          `font-size: ${setting.donateFontSize}px`
        );
      }
    }
  }

  private RadioFontSizeListener() {
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
  }

  private setDriverRadioFontSize() {
    const driver = document.querySelector("#radio #driver-name");
    const driverRadio = document.querySelector("#radio #driver-radio");
    const teamConstructors = document.querySelectorAll("#radio #constructor");

    if (driver) {
      driver.setAttribute("style", `font-size: ${setting.radioFontSize}px;`);
    }
    if (driverRadio) {
      driverRadio.setAttribute(
        "style",
        `font-size: ${setting.radioFontSize}px;`
      );
    }
    if (teamConstructors) {
      teamConstructors.forEach((teamConstructor) => {
        teamConstructor.setAttribute(
          "style",
          `height: ${setting.radioFontSize}px;`
        );
      });
    }
  }

  private incomingRadioVolumeListener() {
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
        setting.incomingRadioVolume = parseInt(input.value) / 100;
      });
    }
  }

  private setOpeningRadioVolume() {
    const input = document.getElementById(
      "openingRadioVolumeInput"
    ) as HTMLInputElement;
    const volumeSelected = document.getElementById(
      "openingRadioVolumeSelected"
    );

    if (setting.status === "ready" && input && volumeSelected) {
      input.value = (setting.incomingRadioVolume * 100).toString();
      volumeSelected.innerText = (setting.incomingRadioVolume * 100).toString();
    } else if (setting.status !== "ready" && input && volumeSelected) {
      volumeSelected.innerText = input.value.toString();
      setting.incomingRadioVolume = parseInt(input.value) / 100;
    }
  }

  private donateFromVolumeListener() {
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
        setting.donateFromVolume = parseInt(input.value) / 100;
      });
    }
  }

  private setDonateFromVolume() {
    const input = document.getElementById(
      "donationFromVolumeInput"
    ) as HTMLInputElement;
    const volumeSelected = document.getElementById(
      "donationFromVolumeSelected"
    );
    if (setting.status === "ready" && input && volumeSelected) {
      input.value = (setting.donateFromVolume * 100).toString();
      volumeSelected.innerText = (setting.donateFromVolume * 100).toString();
    } else if (setting.status !== "ready" && input && volumeSelected) {
      volumeSelected.innerText = input.value.toString();
      setting.donateFromVolume = parseInt(input.value) / 100;
    }
  }

  private donateMessageVolumeListener() {
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
        setting.donateMessageVolume = parseInt(input.value) / 100;
      });
    }
  }

  private setDonateMessageVolume() {
    const input = document.getElementById(
      "donationMessageVolumeInput"
    ) as HTMLInputElement;
    const volumeSelected = document.getElementById(
      "donationMessageVolumeSelected"
    );

    if (setting.status === "ready" && input && volumeSelected) {
      input.value = (setting.donateMessageVolume * 100).toString();
      volumeSelected.innerText = (setting.donateMessageVolume * 100).toString();
    } else if (setting.status !== "ready" && input && volumeSelected) {
      volumeSelected.innerText = input.value.toString();
      setting.donateMessageVolume = parseInt(input.value) / 100;
    }
  }

  private distortionInputListener() {
    const input = document.getElementById(
      "radioVoiceEffectDistortionValue"
    ) as HTMLInputElement;
    const distortionSelected = document.getElementById(
      "radioVoiceEffectDistortionValueSelected"
    );

    if (input && distortionSelected) {
      input.addEventListener("input", (e) => {
        e.preventDefault();
        distortionSelected.innerText = input.value;
        setting.radioVoiceEffectDistortionValue = parseInt(input.value);
      });
    }
  }

  private setDistortionInput() {
    const input = document.getElementById(
      "radioVoiceEffectDistortionValue"
    ) as HTMLInputElement;
    const distortionSelected = document.getElementById(
      "radioVoiceEffectDistortionValueSelected"
    );
    if (setting.status === "ready" && input && distortionSelected) {
      input.value = setting.radioVoiceEffectDistortionValue.toString();
      distortionSelected.innerText =
        setting.radioVoiceEffectDistortionValue.toString();
    } else if (setting.status !== "ready" && input && distortionSelected) {
      distortionSelected.innerText = input.value.toString();
      setting.radioVoiceEffectDistortionValue = parseInt(input.value);
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
