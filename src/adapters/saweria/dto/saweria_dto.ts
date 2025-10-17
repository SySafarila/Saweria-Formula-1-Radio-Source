type SaweriaMediaShare = {
    type: "yt" | "tiktok";
    amount_to_display: number;
    end: number;
    id: string;
    is_nsfw: boolean;
    start: number;
};

type SaweriaSoundBoard = {
    type: "sb";
    name: string;
    fileUrl: string;
    amount_to_display: number;
    id: number;
};

type SaweriaAlertGif = {
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