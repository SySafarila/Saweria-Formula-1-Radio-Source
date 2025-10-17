import {cashRegisterSound, incomingRadioSound} from "./base64Audios";

export default class Sound {
    static playCashRegister() {
        return new Promise((resolve, reject) => {
            try {
                const sound = new Audio(`data:audio/wav;base64,${cashRegisterSound}`)
                sound.play().catch((e) => reject(e));
                sound.addEventListener(
                    "ended",
                    () => {
                        resolve("Success!");
                    },
                    {
                        once: true
                    }
                );
            } catch (e) {
                reject("Failed to play Cash Register")
            }
        })
    }

    static playIncomingRadio() {
        return new Promise((resolve, reject) => {
            try {
                const sound = new Audio(`data:audio/wav;base64,${incomingRadioSound}`)
                sound.play().catch((e) => reject(e));
                sound.addEventListener(
                    "ended",
                    () => {
                        resolve("Success!");
                    },
                    {
                        once: true
                    }
                );
            } catch (e) {
                reject("Failed to play Incoming Radio Sound")
            }
        })
    }


    static async playTextToSpeech(tts: string, withRadioEffect: boolean = false) {
        return new Promise((resolve, reject) => {
            try {
                const sound = new Audio(`data:audio/wav;base64,${tts}`)
                if (withRadioEffect == true) {
                    const radioEffect = Sound.makeRadioEffect(sound);
                    radioEffect.resume();
                }
                sound.play().catch((e) => reject(e));
                sound.addEventListener(
                    "ended",
                    () => {
                        resolve("Success!");
                    },
                    {
                        once: true
                    }
                );
            } catch (e) {
                reject("Failed to play Cash Register")
            }
        })
    }

    static makeRadioEffect(audio: HTMLAudioElement): AudioContext {
        const lowpassValue = 3000;
        const highpassValue = 500;
        const distortionValue = 200;

        const audioContext = new window.AudioContext();
        const source = audioContext.createMediaElementSource(audio);

        const lowpassFilter = audioContext.createBiquadFilter();
        lowpassFilter.type = "lowpass";
        lowpassFilter.frequency.value = lowpassValue;

        const highpassFilter = audioContext.createBiquadFilter();
        highpassFilter.type = "highpass";
        highpassFilter.frequency.value = highpassValue;

        const distortion = audioContext.createWaveShaper();
        distortion.curve = Sound.makeDistortionCurve(distortionValue);
        distortion.oversample = "4x";

        source.connect(highpassFilter);
        highpassFilter.connect(lowpassFilter);
        lowpassFilter.connect(distortion);
        distortion.connect(audioContext.destination);

        return audioContext;
    }

    static makeDistortionCurve(amount: number) {
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
}