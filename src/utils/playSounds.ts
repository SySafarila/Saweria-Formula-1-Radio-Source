import { setting } from "..";
import { cashRegisterSound, incomingRadioSound } from "./base64Audios";
import makeRadioEffect from "./makeRadioEffect";

export const playTtsFrom = (base64: string) => {
  return new Promise((resolve, reject) => {
    try {
      const sound = new Audio(base64);
      sound.volume = setting.donationFromVolume;
      sound.play();
      sound.addEventListener("pause", () => {
        resolve("Success!");
      });
    } catch (error) {
      reject("Failed!");
    }
  });
};

export const playTtsMessage = (base64: string) => {
  return new Promise((resolve, reject) => {
    try {
      const sound = new Audio(base64);
      if (setting.radioVoiceEffect == true) {
        const radioEffect = makeRadioEffect(sound);
        radioEffect.resume();
      }
      sound.volume = setting.donationMessageVolume;
      sound.play();
      sound.addEventListener("pause", () => {
        resolve("Success!");
      });
    } catch (error) {
      reject("Failed!");
    }
  });
};

export const playOpeningRadio = () => {
  return new Promise((resolve, reject) => {
    try {
      const sound = new Audio(`data:audio/wav;base64,${incomingRadioSound}`);
      sound.volume = setting.openingRadioVolume;
      sound.play();
      sound.addEventListener("pause", () => {
        resolve("Success!");
      });
    } catch (error) {
      reject("Failed!");
    }
  });
};

export const playCashRegister = () => {
  return new Promise((resolve, reject) => {
    try {
      const sound = new Audio(`data:audio/wav;base64,${cashRegisterSound}`);
      sound.volume = setting.openingRadioVolume;
      sound.play();
      sound.addEventListener("pause", () => {
        resolve("Success!");
      });
    } catch (error) {
      reject("Failed!");
    }
  });
};

export const playCustomSaweriaNotif = (url: string) => {
  return new Promise((resolve, reject) => {
    try {
      const sound = new Audio(url);
      sound.volume = setting.openingRadioVolume;
      sound.play();
      sound.addEventListener("pause", () => {
        resolve("Success!");
      });
    } catch (error) {
      reject("Failed!");
    }
  });
};
