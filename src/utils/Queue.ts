import { settings, socket, startF1Notif } from "..";
import { SaweriaAlertGif, SaweriaDonation, SaweriaMessage } from "../types";
import { startAudioVisual, stopAudioVisual } from "./audioVisual";
import startDelay from "./delay";
import {
  playCashRegister,
  playCustomSaweriaNotif,
  playOpeningRadio,
  playTtsFrom,
  playTtsMessage,
} from "./playSounds";
import { hideRadio, showRadio } from "./radio";

class SaweriaQueue {
  private isPlaying: boolean = false;
  private queue: SaweriaDonation[] = [];

  constructor() {
    //
  }

  getQueue(): SaweriaDonation[] {
    return this.queue;
  }

  getWillPlayingDonation(): SaweriaDonation {
    return this.queue[0];
  }

  getPlayingStatus(): boolean {
    return this.isPlaying;
  }

  addQueue(donation: SaweriaDonation): void {
    this.queue.push(donation);
    if (this.getPlayingStatus() === false) {
      this.startQueue();
    }
  }

  async startQueue() {
    console.log(
      `Showing donation from ${this.getWillPlayingDonation().donator}`
    );

    this.isPlaying = true;

    let customSaweriaNotifUrl: string | undefined = undefined;
    const customSaweriaNotifObject = this.getWillPlayingDonation().sound;
    if (
      customSaweriaNotifObject &&
      typeof customSaweriaNotifObject === "object"
    ) {
      const soundKeys = Object.keys(customSaweriaNotifObject);
      soundKeys.forEach((key) => {
        const soundUrl: string = customSaweriaNotifObject[key];
        customSaweriaNotifUrl = soundUrl;
      });
    }

    const tts = this.getWillPlayingDonation().tts;

    // show donation: start
    showRadio(this.getWillPlayingDonation());

    if (tts) {
      if (customSaweriaNotifUrl) {
        await playCustomSaweriaNotif(customSaweriaNotifUrl);
      } else {
        await playCashRegister();
      }

      await playTtsFrom(`data:audio/wav;base64,${tts[0]}`);
      startAudioVisual();

      if (settings.openingRadioSound == "on") {
        await playOpeningRadio();
      }

      await playTtsMessage(`data:audio/wav;base64,${tts[1]}`);
      stopAudioVisual();
      await startDelay(settings.showMessageTime);
      hideRadio();
      await startDelay(1000); // delay 1 detik
    } else {
      if (customSaweriaNotifUrl) {
        await playCustomSaweriaNotif(customSaweriaNotifUrl);
      } else {
        await playCashRegister();
      }

      startAudioVisual();

      if (settings.openingRadioSound == "on") {
        await playOpeningRadio();
      }

      await startDelay(settings.showMessageTime);
      stopAudioVisual();
      await startDelay(1000); // delay 1 detik
      hideRadio();
      await startDelay(1000); // delay 1 detik
    }
    // show donation: end

    this.deletePlayedQueue();

    if (this.queue.length >= 1) {
      this.startQueue();
    }
  }

  deletePlayedQueue(): void {
    if (this.queue.length >= 1) {
      this.isPlaying = false;
      this.queue.splice(0, 1);
    }
  }

  // use arrow function for callback
  onOpen = (): void => {
    console.log("Socket open");
  };

  // use arrow function for callback
  onMessage = (e: { data: any }): void => {
    const donation_json: SaweriaMessage = JSON.parse(e.data);
    const donations = donation_json.data;

    donations.forEach((donation) => {
      const media = donation.media as SaweriaAlertGif | null;

      // only accept alert donation, not media share or sound board
      if (media == null || media.tag == "picture") {
        this.addQueue(donation);
      }
    });
  };

  // use arrow function for callback
  onClose = (): void => {
    socket.removeEventListener("open", this.onOpen, true);
    socket.removeEventListener("message", this.onMessage, true);
    socket.removeEventListener("close", this.onClose, true);

    startF1Notif();
  };
}

export const Queue = new SaweriaQueue();
