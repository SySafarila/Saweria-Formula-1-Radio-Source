import queryString from "query-string";
import { Queries } from "../types";
import streamKeyParser from "./streamKeyParser";

const parsed = queryString.parse(location.search) as Queries;
const {
  streamKey,
  showMessageTime,
  radioVoiceEffectDistortionValue,
  radioVoiceEffect,
  openingRadioSound,
  driverName,
  status,
  teams,
  openingRadioVolume,
  donationFromVolume,
  donationMessageVolume,
} = parsed;

export default class SettingClass {
  streamKey: string = "your-stream-key";
  showMessageTime: number = 5000;
  radioVoiceEffect: boolean = true;
  radioVoiceEffectDistortionValue: number = 200;
  openingRadioSound: "on" | "off" = "on";
  teams: Queries["teams"] = "ferrari";
  driverName: string = "Denaldi";
  openingRadioVolume: number = 1;
  donationFromVolume: number = 1;
  donationMessageVolume: number = 1;

  constructor() {
    this.setStreamKey();
    this.setShowMessageTime();
    this.setRadioVoiceEffect();
    this.setRadioVoiceEffectDistortionValue();
    this.setIncomingRadioSound();
    this.setTeam();
    this.setDriverName();
    this.setOpeningRadioVolume();
    this.setDonationFromVolume();
    this.setDonationMessageVolume();
    console.log("Setting loaded:");
  }

  private setStreamKey() {
    if (streamKey) {
      try {
        this.streamKey = streamKeyParser(streamKey);
      } catch (error: any) {
        window.alert(error.message);
        window.location.href = window.location.pathname;
      }
    }
  }

  private setShowMessageTime() {
    if (showMessageTime && !isNaN(showMessageTime)) {
      this.showMessageTime = showMessageTime * 1000;
    }
  }

  private setRadioVoiceEffect() {
    if (radioVoiceEffect) {
      if (radioVoiceEffect === "on") {
        this.radioVoiceEffect = true;
      }
      if (radioVoiceEffect === "off") {
        this.radioVoiceEffect = false;
      }
    }
  }

  private setRadioVoiceEffectDistortionValue() {
    if (
      radioVoiceEffectDistortionValue &&
      !isNaN(radioVoiceEffectDistortionValue)
    ) {
      this.radioVoiceEffectDistortionValue = radioVoiceEffectDistortionValue;
    }
  }

  private setIncomingRadioSound() {
    if (openingRadioSound) {
      if (openingRadioSound === "on") {
        this.openingRadioSound = "on";
      }
      if (openingRadioSound === "off") {
        this.openingRadioSound = "off";
      }
    }
  }

  private setTeam() {
    if (teams) {
      this.teams = teams;
    }
  }

  private setDriverName() {
    if (driverName) {
      this.driverName = driverName;
    }
  }

  private setOpeningRadioVolume() {
    if (openingRadioVolume && !isNaN(openingRadioVolume)) {
      this.openingRadioVolume = openingRadioVolume / 100;
    }
  }

  private setDonationFromVolume() {
    if (donationFromVolume && !isNaN(donationFromVolume)) {
      this.donationFromVolume = donationFromVolume / 100;
    }
  }

  private setDonationMessageVolume() {
    if (donationMessageVolume && !isNaN(donationMessageVolume)) {
      this.donationMessageVolume = donationMessageVolume / 100;
    }
  }
}
