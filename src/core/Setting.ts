import queryString from "query-string";

export default class Setting {
    provider: string;
    sourceOverlayUrl: string;
    overlayType: string;

    constructor() {
        this.initMainSettings()
    }

    protected initMainSettings(): void {
        const q = queryString.parse(location.search) as {
            provider: string;
            sourceOverlay: string;
            overlayType: string;
        };

        if (q.overlayType) this.overlayType = q.overlayType;
        if (q.provider) this.provider = q.provider;
        if (q.sourceOverlay) this.sourceOverlayUrl = q.sourceOverlay;

        const mainSetting = document.querySelector('#config-master')
        if (this.overlayType && this.provider && this.sourceOverlayUrl) mainSetting.classList.add('hidden')
    }
}