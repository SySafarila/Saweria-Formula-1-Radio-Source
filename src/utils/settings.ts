import queryString from "query-string";
import { Queries, Settings } from "../types";
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

export const settings: Settings = {
  openingRadioSound: openingRadioSound == "on" ? "on" : "off",
  radioVoiceEffect: radioVoiceEffect == "on" ? true : false,
  radioVoiceEffectDistortionValue: radioVoiceEffectDistortionValue ?? 200,
  showMessageTime: showMessageTime ? showMessageTime * 1000 : 5000, // ms
  streamKey: streamKey ? streamKeyParser(streamKey) : "your-stream-key",
  driverName: driverName ?? "Denaldi",
  teams: teams ? teams : "ferrari",
  donationFromVolume: donationFromVolume ? donationFromVolume / 100 : 1,
  donationMessageVolume: donationMessageVolume
    ? donationMessageVolume / 100
    : 1,
  openingRadioVolume: openingRadioVolume ? openingRadioVolume / 100 : 1,
};
