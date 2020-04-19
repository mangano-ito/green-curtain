export default class PhotoTakeDialog {
    private dialogElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private dismissButtonElement: HTMLButtonElement;

    constructor() {
        const dialogElement = document.querySelector<HTMLElement>('#taken_photo_dialog');
        const imageElement = document.querySelector<HTMLImageElement>('#taken_photo');
        const dismissButtonElement = document.querySelector<HTMLButtonElement>('#taken_photo_dialog_dismiss');
        if (!dialogElement || !imageElement || !dismissButtonElement) {
            throw new Error('photo take dialog elements are required.');
        }
        this.dialogElement = dialogElement;
        this.imageElement = imageElement;
        this.dismissButtonElement = dismissButtonElement;
        this.attach();
    }

    show(imageUrl: string) {
        this.imageElement.src = imageUrl;
        this.dialogElement.classList.remove('hidden');
    }

    dismiss() {
        this.dialogElement.classList.add('hidden');
    }

    private attach() {
        this.dismissButtonElement.addEventListener('click', () => this.dismiss());
    }
}
