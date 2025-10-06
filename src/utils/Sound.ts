import {cashRegisterSound} from "./base64Audios";

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

    static async playTextToSpeech(tts: string) {
        return new Promise((resolve, reject) => {
            try {
                const sound = new Audio(`data:audio/wav;base64,${tts}`)
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
}