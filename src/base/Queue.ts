import Donation from "./Donation";
import Overlay from "./Overlay";

export default class Queue {
    private isPlaying: boolean = false;
    private donations: Donation[] = [];
    private overlay: Overlay;

    constructor(overlay: Overlay) {
        this.overlay = overlay;
    }

    private getDonation(): Donation {
        return this.donations[0];
    }

    async addDonationToQueue(donation: Donation) {
        this.donations.push(donation);
        if (this.isPlaying === false) {
            await this.startQueue();
        }
    }

    private async startQueue() {
        this.isPlaying = true;

        // display donation
        await this.overlay.showOverlay({
            donation: this.getDonation(),
            delayToDisplay: 5000,
            delayToHide: 10000
        })

        this.deletePlayedDonation();

        if (this.donations.length >= 1) {
            await this.startQueue();
        }
    }

    private deletePlayedDonation(): void {
        if (this.donations.length >= 1) {
            this.isPlaying = false;
            this.donations.splice(0, 1);
        }
    }
}