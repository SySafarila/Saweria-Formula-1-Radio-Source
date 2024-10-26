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
};

export type SaweriaMessage = {
  type: "donation" | "pong";
  data: SaweriaDonation[];
};

export type Settings = {
  openingRadioSound: "on" | "off";
  radioVoiceEffect: boolean;
  radioVoiceEffectDistortionValue: number;
  showMessageTime: number;
  streamKey: string;
  driverName?: string;
  teams?:
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
};

export type Queries = {
  streamKey?: string;
  showMessageTime?: number;
  radioVoiceEffectDistortionValue?: number;
  radioVoiceEffect?: "on" | "off";
  openingRadioSound?: "on" | "off";
  driverName?: string;
  status?: "ready";
  teams?:
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
};
