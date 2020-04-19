export type OnIntensityUpdatedListener = (
    intensityHue: number,
    intensitySaturation: number,
    intensityValue: number,
) => any;

export default class IntensityControl {
    private intensityHueSliderElement: HTMLInputElement;
    private intensitySaturationSliderElement: HTMLInputElement;
    private intensityValueSliderElement: HTMLInputElement;

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
        this.attach();
    }

    setOnIntensityUpdatedListener(listener: OnIntensityUpdatedListener) {
        this.onIntensityUpdatedListener = listener;
    }

    private onIntensityUpdated() {
        this.onIntensityUpdatedListener(
            parseInt(this.intensityHueSliderElement.value || '20') / 100,
            parseInt(this.intensitySaturationSliderElement.value || '70') / 100,
            parseInt(this.intensityValueSliderElement.value || '80') / 100,
        );
    }

    private attach() {
        this.intensityHueSliderElement.addEventListener('change', () => this.onIntensityUpdated());
        this.intensitySaturationSliderElement.addEventListener('change', () => this.onIntensityUpdated());
        this.intensityValueSliderElement.addEventListener('change', () => this.onIntensityUpdated())
    }
}
