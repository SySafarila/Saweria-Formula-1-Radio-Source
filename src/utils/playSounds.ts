import { settings } from "..";
import radio from "./base64Radio";
import makeRadioEffect from "./makeRadioEffect";

export const playTtsFrom = (base64: string) => {
  return new Promise((resolve, reject) => {
    try {
      const sound = new Audio(base64);
      sound.volume = settings.donationFromVolume;
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
      if (settings.radioVoiceEffect == true) {
        const radioEffect = makeRadioEffect(sound);
        radioEffect.resume();
      }
      sound.volume = settings.donationMessageVolume;
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
      const sound = new Audio(`data:audio/wav;base64,${radio}`);
      sound.volume = settings.openingRadioVolume;
      sound.play();
      sound.addEventListener("pause", () => {
        resolve("Success!");
      });
    } catch (error) {
      reject("Failed!");
    }
  });
};
