import { OnBackgroundImageUpdatedListener } from "./BackgroundImageControl";

export type OnBackgroundYouTubeUpdatedListener = (id: string) => any;

export default class BackgroundYouTubeControl {
    private backgroundYouTubeIdTextElement: HTMLInputElement;

    private onBackgroundYouTubeUpdatedListener: OnBackgroundImageUpdatedListener = () => {};

    constructor(backgroundYouTubeIdTextElementQuery: string = '#background_youtube') {
        const element = document.querySelector<HTMLInputElement>(backgroundYouTubeIdTextElementQuery);
        if (!element) {
            throw new Error('background YouTube ID text element is required.');
        }
        this.backgroundYouTubeIdTextElement = element;
        this.attach();
    }

    setOnBackgroundYouTubeUpdatedListener(listener: OnBackgroundYouTubeUpdatedListener) {
        this.onBackgroundYouTubeUpdatedListener = listener;
    }

    private onUpdated() {
        const id = this.backgroundYouTubeIdTextElement.value;
        this.onBackgroundYouTubeUpdatedListener(id);
    }

    private attach() {
        this.backgroundYouTubeIdTextElement.addEventListener('change', () => this.onUpdated());
    }
}
