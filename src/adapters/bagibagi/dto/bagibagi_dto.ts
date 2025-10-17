export type BagiBagiDonation = {
    type: number;
    target: "UserDonated";
    arguments: {
        amount: number;
        message: string;
        preferedName: string;
        mediaShare: string;
    }[];
}