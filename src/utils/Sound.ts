import { queue, setting } from "..";
import { cashRegisterSound, incomingRadioSound } from "./base64Audios";
import { exampleDonation } from "./exampleDonation";

export default class Sound {
  constructor() {
    //
  }

  private makeDistortionCurve(amount: number) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] =
        ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  private makeRadioEffect(audio: HTMLAudioElement): AudioContext {
    const lowpassValue = 3000;
    const highpassValue = 500;
    const distortionValue = setting.radioVoiceEffectDistortionValue ?? 200;

    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaElementSource(audio);

    const lowpassFilter = audioContext.createBiquadFilter();
    lowpassFilter.type = "lowpass";
    lowpassFilter.frequency.value = lowpassValue;

    const highpassFilter = audioContext.createBiquadFilter();
    highpassFilter.type = "highpass";
    highpassFilter.frequency.value = highpassValue;

    const distortion = audioContext.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(distortionValue);
    distortion.oversample = "4x";

    source.connect(highpassFilter);
    highpassFilter.connect(lowpassFilter);
    lowpassFilter.connect(distortion);
    distortion.connect(audioContext.destination);

    return audioContext;
  }

  playTtsFrom(base64: string) {
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
  }

  playTtsMessage(base64: string) {
    return new Promise((resolve, reject) => {
      try {
        const sound = new Audio(base64);
        if (setting.radioVoiceEffect == true) {
          const radioEffect = this.makeRadioEffect(sound);
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
  }

  playOpeningRadio() {
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
  }

  playCashRegister() {
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
  }

  playCustomSaweriaNotif(url: string) {
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
  }

  playExampleDonation() {
    queue.addQueue(exampleDonation);
  }
}
