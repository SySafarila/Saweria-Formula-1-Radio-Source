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
  streamKey: string = streamKey
    ? streamKeyParser(streamKey)
    : "your-stream-key";
  showMessageTime: number = showMessageTime ? showMessageTime * 1000 : 5000;
  radioVoiceEffect: boolean = radioVoiceEffect == "on" ? true : false;
  radioVoiceEffectDistortionValue: number =
    radioVoiceEffectDistortionValue ?? 200;
  openingRadioSound: "on" | "off" = openingRadioSound == "on" ? "on" : "off";
  teams: Queries["teams"] = teams ? teams : "ferrari";
  driverName: string = driverName ?? "Denaldi";
  openingRadioVolume: number = openingRadioVolume
    ? openingRadioVolume / 100
    : 1;
  donationFromVolume: number = donationFromVolume
    ? donationFromVolume / 100
    : 1;
  donationMessageVolume: number = donationMessageVolume
    ? donationMessageVolume / 100
    : 1;

  constructor() {
    console.log("Setting loaded");
  }
}
