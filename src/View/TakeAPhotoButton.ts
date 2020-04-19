export type OnPhotoTakeRequestedListener = () => any;

export default class TakeAPhotoButton {
    private buttonElement: HTMLButtonElement;

    private onPhotoTakeRequestListener: OnPhotoTakeRequestedListener = () => {};

    constructor(takeAPhotoButtonQuery: string = '#take_a_photo') {
        const element = document.querySelector<HTMLButtonElement>(takeAPhotoButtonQuery);
        if (!element) {
            throw new Error('background image text element is required.');
        }
        this.buttonElement = element;
        this.attach();
    }

    setOnPhotoTakeRequestedListener(listener: OnPhotoTakeRequestedListener) {
        this.onPhotoTakeRequestListener = listener;
    }

    private attach() {
        this.buttonElement.addEventListener('click', () => {
            this.onPhotoTakeRequestListener();
        });
    }
}
