export type OnIntensityUpdatedListener = (
    intensityHue: number,
    intensitySaturation: number,
    intensityValue: number,
) => any;

export default class IntensityControl {
    private intensityHueSliderElement: HTMLInputElement;
    private intensitySaturationSliderElement: HTMLInputElement;
    private intensityValueSliderElement: HTMLInputElement;

    private defaultIntensityHue: number = 20;
    private defaultIntensitySaturation: number = 70;
    private defaultIntensityValue: number = 80;
    private maxValue = 100;

    private onIntensityUpdatedListener: OnIntensityUpdatedListener = () => {};

    constructor(
        intensityHueSliderElementQuery: string = '#intensity_h',
        intensitySaturationSliderElementQuery: string = '#intensity_s',
        intensityValueSliderElementQuery: string = '#intensity_v',
    ) {
        const intensityElementH = document.querySelector<HTMLInputElement>(intensityHueSliderElementQuery);
        const intensityElementS = document.querySelector<HTMLInputElement>(intensitySaturationSliderElementQuery);
        const intensityElementV = document.querySelector<HTMLInputElement>(intensityValueSliderElementQuery)
        if (!intensityElementH || !intensityElementS || !intensityElementV) {
            throw new Error('intensity sliders are required.');
        }
        this.intensityHueSliderElement = intensityElementH;
        this.intensitySaturationSliderElement = intensityElementS;
        this.intensityValueSliderElement = intensityElementV;
        this.reset();
        this.attach();
    }

    reset() {
        this.intensityHueSliderElement.value = this.defaultIntensityHue + '';
        this.intensitySaturationSliderElement.value = this.defaultIntensityHue + '';
        this.intensityValueSliderElement.value = this.defaultIntensityHue + '';
        this.intensityHueSliderElement.max = this.maxValue + '';
        this.intensitySaturationSliderElement.max = this.maxValue + '';
        this.intensityValueSliderElement.max = this.maxValue + '';
    }

    setOnIntensityUpdatedListener(listener: OnIntensityUpdatedListener) {
        this.onIntensityUpdatedListener = listener;
    }

    private onIntensityUpdated() {
        this.onIntensityUpdatedListener(
            (parseInt(this.intensityHueSliderElement.value) || this.defaultIntensityHue) / this.maxValue,
            (parseInt(this.intensitySaturationSliderElement.value) || this.defaultIntensitySaturation) / this.maxValue,
            (parseInt(this.intensityValueSliderElement.value) || this.defaultIntensityValue) / this.maxValue,
        );
    }

    private attach() {
        this.intensityHueSliderElement.addEventListener('change', () => this.onIntensityUpdated());
        this.intensitySaturationSliderElement.addEventListener('change', () => this.onIntensityUpdated());
        this.intensityValueSliderElement.addEventListener('change', () => this.onIntensityUpdated())
    }
}
