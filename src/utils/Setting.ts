import queryString from "query-string";
import { Queries, Settings } from "../types";
import streamKeyParser from "./streamKeyParser";

const query = queryString.parse(location.search) as Queries;

export default class SettingClass {
  streamKey: Settings["streamKey"] = "your-stream-key";
  donateDuration: Settings["donateDuration"] = 5000;
  radioVoiceEffect: Settings["radioVoiceEffect"] = true;
  radioVoiceEffectDistortionValue: Settings["radioVoiceEffectDistortionValue"] = 200;
  incomingRadio: Settings["incomingRadio"] = true;
  team: Settings["team"] = "ferrari";
  driverName: Settings["driverName"] = "Safarila";
  incomingRadioVolume: Settings["incomingRadioVolume"] = 1;
  donateFromVolume: Settings["donateFromVolume"] = 1;
  donateMessageVolume: Settings["donateMessageVolume"] = 1;
  status: Settings["status"] = query.status;
  donateFontSize: Settings["donateFontSize"] = 20;
  radioFontSize: Settings["radioFontSize"] = 36;

  constructor() {
    console.log(query);

    this.setStreamKey();
    this.setShowMessageTime();
    this.setRadioVoiceEffect();
    this.setRadioVoiceEffectDistortionValue();
    this.setIncomingRadio();
    this.setTeam();
    this.setDriverName();
    this.setIncomingRadioVolume();
    this.setDonateFromVolume();
    this.setDonateMessageVolume();
    this.setStatus();
    this.setDonateFontSize();
    this.setRadioFontSize();
    console.log("Setting loaded: ", this);
  }

  private setRadioFontSize() {
    if (query.radioFontSize && !isNaN(query.radioFontSize)) {
      this.radioFontSize = query.radioFontSize;
    }
  }

  private setDonateFontSize() {
    if (query.donateFontSize && !isNaN(query.donateFontSize)) {
      this.donateFontSize = query.donateFontSize;
    }
  }

  private setStatus() {
    if (query.status) {
      this.status = query.status;
    }
  }

  private setStreamKey() {
    if (query.streamKey) {
      try {
        this.streamKey = streamKeyParser(query.streamKey);
      } catch (error: any) {
        window.alert(error.message);
        window.location.href = window.location.pathname;
      }
    }
  }

  private setShowMessageTime() {
    if (query.donateDuration && !isNaN(query.donateDuration)) {
      this.donateDuration = query.donateDuration * 1000;
    }
  }

  private setRadioVoiceEffect() {
    if (query.radioVoiceEffect) {
      this.radioVoiceEffect = query.radioVoiceEffect == "on" ? true : false;
    }
  }

  private setRadioVoiceEffectDistortionValue() {
    if (
      query.radioVoiceEffectDistortionValue &&
      !isNaN(query.radioVoiceEffectDistortionValue)
    ) {
      this.radioVoiceEffectDistortionValue =
        query.radioVoiceEffectDistortionValue;
    }
  }

  private setIncomingRadio() {
    if (query.incomingRadio) {
      this.incomingRadio = query.incomingRadio == "on" ? true : false;
    }
  }

  private setTeam() {
    if (query.team) {
      this.team = query.team;
    }
  }

  private setDriverName() {
    if (query.driverName) {
      this.driverName = query.driverName;
    }
  }

  private setIncomingRadioVolume() {
    if (query.incomingRadioVolume && !isNaN(query.incomingRadioVolume)) {
      this.incomingRadioVolume = query.incomingRadioVolume / 100;
    }
  }

  private setDonateFromVolume() {
    if (query.donateFromVolume && !isNaN(query.donateFromVolume)) {
      this.donateFromVolume = query.donateFromVolume / 100;
    }
  }

  private setDonateMessageVolume() {
    if (query.donateMessageVolume && !isNaN(query.donateMessageVolume)) {
      this.donateMessageVolume = query.donateMessageVolume / 100;
    }
  }
}
