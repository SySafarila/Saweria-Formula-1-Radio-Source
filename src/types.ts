export type SaweriaMediaShare = {
  type: "yt" | "tiktok";
  amount_to_display: number;
  end: number;
  id: string;
  is_nsfw: boolean;
  start: number;
};

export type SaweriaSoundBoard = {
  type: "sb";
  name: string;
  fileUrl: string;
  amount_to_display: number;
  id: number;
};

export type SaweriaAlertGif = {
  tag: "picture";
  src: string[];
};

export type SaweriaDonation = {
  amount: number;
  currency: "IDR";
  donator: string;
  is_message_flagged: boolean;
  is_name_flagged: boolean;
  is_replay: boolean;
  is_user: boolean;
  message: string;
  tts?: string[];
  sound?: {
    [key: string]: string;
  };
  media?: SaweriaMediaShare | SaweriaSoundBoard | SaweriaAlertGif;
};

export type SaweriaMessage = {
  type: "donation" | "pong";
  data: SaweriaDonation[];
};

type Team =
  | "ferrari"
  | "mercedes"
  | "redbull"
  | "mclaren"
  | "aston-martin"
  | "haas"
  | "rb"
  | "williams"
  | "alpine"
  | "sauber";

export type Settings = {
  streamKey: string;
  donateDuration: number;
  radioVoiceEffectDistortionValue: number;
  radioVoiceEffect: boolean;
  incomingRadio: boolean;
  driverName: string;
  status: "ready";
  team: Team;
  donateFontSize: number;
  radioFontSize: number;
  incomingRadioVolume: number;
  donateFromVolume: number;
  donateMessageVolume: number;
};

export type Queries = {
  streamKey?: string;
  donateDuration?: number;
  radioVoiceEffectDistortionValue?: number;
  radioVoiceEffect?: "on" | "off";
  incomingRadio?: "on" | "off";
  driverName?: string;
  status?: "ready";
  team?: Team;
  donateFontSize?: number;
  radioFontSize?: number;
  incomingRadioVolume?: number;
  donateFromVolume?: number;
  donateMessageVolume?: number;
};
