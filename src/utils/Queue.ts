import { socket, startF1Notif } from "..";
import { SaweriaAlertGif, SaweriaDonation, SaweriaMessage } from "../types";
import { startAudioVisual, stopAudioVisual } from "./audioVisual";
import startDelay from "./delay";
import messageProcessor from "./messageProcessor";
import numberFormat from "./numberFormat";
import {
  playCashRegister,
  playCustomSaweriaNotif,
  playOpeningRadio,
  playTtsFrom,
  playTtsMessage,
} from "./playSounds";
import { settings } from "./settings";

class SaweriaQueue {
  private isPlaying: boolean = false;
  private queue: SaweriaDonation[] = [];
  private customSaweriaNotifUrl: string | undefined = undefined;

  constructor() {
    //
  }

  getQueue(): SaweriaDonation[] {
    return this.queue;
  }

  getDonation(): SaweriaDonation {
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

  private setCustomSaweriaNotif(): void {
    const customSaweriaNotifObject = this.getDonation().sound;
    if (
      customSaweriaNotifObject &&
      typeof customSaweriaNotifObject === "object"
    ) {
      const soundKeys = Object.keys(customSaweriaNotifObject);
      soundKeys.forEach((key) => {
        const soundUrl: string = customSaweriaNotifObject[key];
        this.customSaweriaNotifUrl = soundUrl;
      });
    }
  }

  private displayRadio() {
    const donation = this.getDonation();
    const radioEl = document.getElementById("radio");
    if (radioEl) {
      if (radioEl.classList.contains("hidden")) {
        const msg = radioEl.querySelector("#message");
        const dnt = radioEl.querySelector("#donation");
        if (msg) {
          msg.innerHTML = messageProcessor(donation.message) ?? "-";
        }
        if (dnt) {
          dnt.innerHTML =
            messageProcessor(
              `${donation.donator} ${
                donation.currency == "IDR" ? "Rp " : donation.currency
              } ${numberFormat(donation.amount)}`
            ) ?? "-";
        }
        radioEl.classList.remove("hidden");
      } else {
        const msg = radioEl.querySelector("#message");
        const dnt = radioEl.querySelector("#donation");
        if (msg) {
          msg.innerHTML = messageProcessor(donation.message) ?? "-";
        }
        if (dnt) {
          dnt.innerHTML =
            messageProcessor(
              `${donation.donator} ${
                donation.currency == "IDR" ? "Rp " : donation.currency
              } ${numberFormat(donation.amount)}`
            ) ?? "-";
        }
      }
    }
  }

  hideRadio() {
    const radioEl = document.getElementById("radio");
    if (radioEl && !radioEl.classList.contains("hidden")) {
      radioEl.classList.add("hidden");
    }
  }

  private async playNotif() {
    if (this.customSaweriaNotifUrl) {
      await playCustomSaweriaNotif(this.customSaweriaNotifUrl);
    } else {
      await playCashRegister();
    }
  }

  private async playOpeningRadio() {
    if (settings.openingRadioSound == "on") {
      await playOpeningRadio();
    }
  }

  async startQueue() {
    console.log(`Showing donation from ${this.getDonation().donator}`);
    const { tts } = this.getDonation();

    this.isPlaying = true;
    this.setCustomSaweriaNotif();

    // show donation: start
    this.displayRadio();

    if (tts) {
      await this.playNotif();
      await playTtsFrom(`data:audio/wav;base64,${tts[0]}`);
      startAudioVisual();
      await this.playOpeningRadio();
      await playTtsMessage(`data:audio/wav;base64,${tts[1]}`);
      stopAudioVisual();
      await startDelay(settings.showMessageTime);
      this.hideRadio();
      await startDelay(1000); // delay 1 detik
    } else {
      await this.playNotif();
      startAudioVisual();
      await this.playOpeningRadio();
      await startDelay(settings.showMessageTime);
      stopAudioVisual();
      await startDelay(1000); // delay 1 detik
      this.hideRadio();
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
    console.log("Socket close");

    socket.removeEventListener("open", this.onOpen, true);
    socket.removeEventListener("message", this.onMessage, true);
    socket.removeEventListener("close", this.onClose, true);

    startF1Notif();
  };
}

export const Queue = new SaweriaQueue();
