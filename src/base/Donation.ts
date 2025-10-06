interface IDonation {
    message: string;
    donatorName: string;
    currency: string;
    amount: number;
    textToSpeeches: string[]
}

export default class Donation implements IDonation {
    message: string;
    donatorName: string;
    currency: string;
    amount: number;
    textToSpeeches: string[];

    constructor(donation: IDonation) {
        this.message = donation.message;
        this.donatorName = donation.donatorName;
        this.currency = donation.currency;
        this.amount = donation.amount;
        this.textToSpeeches = donation.textToSpeeches;
    }
}