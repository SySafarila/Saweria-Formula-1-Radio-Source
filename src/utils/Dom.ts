import queryString from "query-string";
import { sound, startF1Notif } from "..";
import { Queries } from "../types";
import SettingClass from "./Setting";

const query = queryString.parse(location.search) as Queries;

export default class Dom {
  private intervals: NodeJS.Timeout[] = [];
  private setting: SettingClass;

  constructor(setting: SettingClass) {
    this.setting = setting;

    // html input listeners
    this.inputListeners();

    // apply from current setting
    this.setDonateFromVolume();
    this.donationMessageVolumeSetter();
    this.distortionInputSetter();
    this.openingRadioVolumeSetter();
    this.hideForm();
    this.startButtonTrigger();
    this.setDonateDurationInput();
    this.setDonateFontSizeInput();
    this.setTeam();
    this.setRadioVoiceEffect();
    this.playSampleDonation();
    this.setRadioFontSize();
    this.setIncomingRadio();
    this.setTeamRadio();
    this.setDriverName();
    this.donationFontSetter();
    this.driverRadioFontSizeSetter();
    this.setStreamKey();
    this.playIncomingRadio();
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

  private radioVoiceEffectListener() {
    const inputOn = document.getElementById(
      "radioEffectOn"
    ) as HTMLInputElement;
    const inputOff = document.getElementById(
      "radioEffectOff"
    ) as HTMLInputElement;

    if (inputOn) {
      inputOn.addEventListener("input", (e) => {
        this.setting.radioVoiceEffect = true;
      });
    }

    if (inputOff) {
      inputOff.addEventListener("input", (e) => {
        this.setting.radioVoiceEffect = false;
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
        this.setting.incomingRadio = true;
      });
    }

    if (inputOff) {
      inputOff.addEventListener("input", (e) => {
        this.setting.incomingRadio = false;
      });
    }
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

  private donateDurationListener() {
    const input = document.getElementById(
      "showMessageTime"
    ) as HTMLInputElement;

    if (input) {
      input.addEventListener("input", (e) => {
        this.setting.donateDuration = parseInt(input.value) * 1000;
      });
    }
  }

  private setDonateDurationInput() {
    const input = document.getElementById(
      "showMessageTime"
    ) as HTMLInputElement;

    if (
      input &&
      this.setting.status === "ready" &&
      this.setting.donateDuration
    ) {
      input.value = (this.setting.donateDuration / 1000).toString();
    }
  }

  private setDonateFontSizeInput() {
    const input = document.getElementById(
      "donationFontSizeInput"
    ) as HTMLInputElement;

    if (
      input &&
      this.setting.status === "ready" &&
      this.setting.donateFontSize
    ) {
      input.value = this.setting.donateFontSize.toString();
    }
  }

  private setRadioFontSize() {
    const input = document.getElementById(
      "driverRadioFontSizeInput"
    ) as HTMLInputElement;

    if (
      input &&
      this.setting.status === "ready" &&
      this.setting.radioFontSize
    ) {
      input.value = this.setting.radioFontSize.toString();
    }
  }

  private setTeam() {
    const input = document.getElementById("teams") as HTMLInputElement;

    if (input && this.setting.status === "ready" && this.setting.team) {
      input.value = this.setting.team;
    }
  }

  private setIncomingRadio() {
    const inputOn = document.getElementById(
      "openingRadioSoundInputOn"
    ) as HTMLInputElement;
    const inputOff = document.getElementById(
      "openingRadioSoundInputOff"
    ) as HTMLInputElement;

    if (this.setting.status === "ready") {
      if (this.setting.incomingRadio === true && inputOn) {
        inputOn.checked = true;
      }
      if (this.setting.incomingRadio === false && inputOff) {
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

    if (this.setting.status === "ready") {
      if (this.setting.radioVoiceEffect === true && inputOn) {
        inputOn.checked = true;
      }
      if (this.setting.radioVoiceEffect === false && inputOff) {
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
    if (!this.setting.status) {
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

    if (radioEl && this.setting.status === "ready") {
      radioEl.classList.forEach((className) => {
        radioEl.classList.remove(className);
      });

      radioEl.classList.add(this.setting.team ?? "ferrari");
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

    if (this.setting.driverName) {
      driverNameInput.value = this.setting.driverName;
      driverNameEl.innerText = this.setting.driverName;
    }
  }

  private setStreamKey() {
    const streamKeyInput = document.getElementById(
      "streamKeyInput"
    ) as HTMLInputElement;

    if (
      streamKeyInput &&
      this.setting.streamKey &&
      this.setting.status === "ready"
    ) {
      streamKeyInput.value = query.streamKey;
    }
  }

  private hideForm() {
    const formSetting = document.getElementById("formSetting");
    if (
      formSetting &&
      this.setting.status == "ready" &&
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

  private donationFontSetter() {
    const donationFrom: HTMLElement =
      document.querySelector("#radio #donation");
    const donationMessage: HTMLElement =
      document.querySelector("#radio #message");

    if (this.setting.donateFontSize) {
      if (donationFrom) {
        donationFrom.setAttribute(
          "style",
          `font-size: ${this.setting.donateFontSize}px`
        );
      }
      if (donationMessage) {
        donationMessage.setAttribute(
          "style",
          `font-size: ${this.setting.donateFontSize}px`
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

  private driverRadioFontSizeSetter() {
    const driver = document.querySelector("#radio #driver-name");
    const driverRadio = document.querySelector("#radio #driver-radio");
    const teamConstructors = document.querySelectorAll("#radio #constructor");

    if (driver) {
      driver.setAttribute(
        "style",
        `font-size: ${this.setting.radioFontSize}px;`
      );
    }
    if (driverRadio) {
      driverRadio.setAttribute(
        "style",
        `font-size: ${this.setting.radioFontSize}px;`
      );
    }
    if (teamConstructors) {
      teamConstructors.forEach((teamConstructor) => {
        teamConstructor.setAttribute(
          "style",
          `height: ${this.setting.radioFontSize}px;`
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
        this.setting.incomingRadioVolume = parseInt(input.value) / 100;
      });
    }
  }

  private openingRadioVolumeSetter() {
    const input = document.getElementById(
      "openingRadioVolumeInput"
    ) as HTMLInputElement;
    const volumeSelected = document.getElementById(
      "openingRadioVolumeSelected"
    );

    if (this.setting.status === "ready" && input && volumeSelected) {
      input.value = (this.setting.incomingRadioVolume * 100).toString();
      volumeSelected.innerText = (
        this.setting.incomingRadioVolume * 100
      ).toString();
    } else if (this.setting.status !== "ready" && input && volumeSelected) {
      volumeSelected.innerText = input.value.toString();
      this.setting.incomingRadioVolume = parseInt(input.value) / 100;
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
        this.setting.donateFromVolume = parseInt(input.value) / 100;
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
    if (this.setting.status === "ready" && input && volumeSelected) {
      input.value = (this.setting.donateFromVolume * 100).toString();
      volumeSelected.innerText = (
        this.setting.donateFromVolume * 100
      ).toString();
    } else if (this.setting.status !== "ready" && input && volumeSelected) {
      volumeSelected.innerText = input.value.toString();
      this.setting.donateFromVolume = parseInt(input.value) / 100;
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
        this.setting.donateMessageVolume = parseInt(input.value) / 100;
      });
    }
  }

  private donationMessageVolumeSetter() {
    const input = document.getElementById(
      "donationMessageVolumeInput"
    ) as HTMLInputElement;
    const volumeSelected = document.getElementById(
      "donationMessageVolumeSelected"
    );

    if (this.setting.status === "ready" && input && volumeSelected) {
      input.value = (this.setting.donateMessageVolume * 100).toString();
      volumeSelected.innerText = (
        this.setting.donateMessageVolume * 100
      ).toString();
    } else if (this.setting.status !== "ready" && input && volumeSelected) {
      volumeSelected.innerText = input.value.toString();
      this.setting.donateMessageVolume = parseInt(input.value) / 100;
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
        this.setting.radioVoiceEffectDistortionValue = parseInt(input.value);
      });
    }
  }

  private distortionInputSetter() {
    const input = document.getElementById(
      "radioVoiceEffectDistortionValue"
    ) as HTMLInputElement;
    const distortionSelected = document.getElementById(
      "radioVoiceEffectDistortionValueSelected"
    );
    if (this.setting.status === "ready" && input && distortionSelected) {
      input.value = this.setting.radioVoiceEffectDistortionValue.toString();
      distortionSelected.innerText =
        this.setting.radioVoiceEffectDistortionValue.toString();
    } else if (this.setting.status !== "ready" && input && distortionSelected) {
      distortionSelected.innerText = input.value.toString();
      this.setting.radioVoiceEffectDistortionValue = parseInt(input.value);
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
