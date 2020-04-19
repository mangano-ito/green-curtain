export type OnBackgroundImageUpdatedListener = (url: string) => any;

export default class BackgroundImageControl {
    private backgroundImageTextElement: HTMLInputElement;

    private onBackgroundImageUpdatedListener: OnBackgroundImageUpdatedListener = () => {};

    constructor(backgroundImageTextElementQuery: string = '#background_image') {
        const element = document.querySelector<HTMLInputElement>(backgroundImageTextElementQuery);
        if (!element) {
            throw new Error('background image text element is required.');
        }
        this.backgroundImageTextElement = element;
        this.attach();
    }

    setOnBackgroundImageUpdatedListener(listener: OnBackgroundImageUpdatedListener) {
        this.onBackgroundImageUpdatedListener = listener;
    }

    private attach() {
        this.backgroundImageTextElement.addEventListener('change', () => {
            this.onBackgroundImageUpdatedListener(this.backgroundImageTextElement.value);
        });
    }
}
