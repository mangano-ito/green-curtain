export type OnMaskColorUpdatedListener = (color: string) => any;

export default class MaskColorControl {
    private colorPickerElement: HTMLInputElement;
    private colorTextElement: HTMLInputElement;

    private onMaskColorUpdatedListener: OnMaskColorUpdatedListener = () => {};

    constructor(
        colorPickerElementQuery: string = '#mask_color',
        colorTextElementQuery: string = '#mask_color_text',
    ) {
        const colorPickerElement = document.querySelector<HTMLInputElement>(colorPickerElementQuery);
        const colorTextElement = document.querySelector<HTMLInputElement>(colorTextElementQuery);
        if (!colorPickerElement || !colorTextElement) {
            throw new Error('mask color picker elements are required.');
        }

        this.colorPickerElement = colorPickerElement;
        this.colorTextElement = colorTextElement;
        this.attach();
    }

    setOnMaskColorUpdateListener(listener: OnMaskColorUpdatedListener) {
        this.onMaskColorUpdatedListener = listener;
    }

    private attach() {
        this.colorPickerElement.addEventListener('change', () => {
            const colorString = this.colorPickerElement.value || '#ffffff';
            this.colorTextElement.value = colorString;
            this.onMaskColorUpdatedListener(colorString);

        });
        this.colorTextElement.addEventListener('change', () => {
            const colorString = this.colorTextElement.value || '#ffffff';
            this.colorPickerElement.value = colorString;
            this.onMaskColorUpdatedListener(colorString);
        });
    }
}
