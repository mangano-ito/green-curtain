import Renderer from '#/Delegates/Renderer';
import UserVideoStream from '#/Delegates/UserVideoStream';

/**
 * green-curtain application controller
 */
export default class App {
    private video = new UserVideoStream();
    private renderer: Renderer | undefined;
    private canvasElement: HTMLCanvasElement;

    /**
     * @param canvasQuery query for canvas element
     */
    constructor(canvasQuery: string) {
        const canvasElement = document.querySelector<HTMLCanvasElement>(canvasQuery);
        if (!canvasElement) {
            throw new Error('The Canvas is required.');
        }
        this.canvasElement = canvasElement;
        this.attachListeners();
    }

    /**
     * run application
     */
    async run() {
        const videoElement = await this.video.waitForVideoStreamElement();
        const noticeElement = document.querySelector<HTMLElement>('#notice');
        if (noticeElement) {
            noticeElement.style.opacity = '0';
        }
        this.renderer = new Renderer(this.canvasElement, videoElement);
        this.renderer.startRendering();
    }

    updateMaskColor(colorString: string) {
        this.renderer?.updateMaskColor(colorString);
    }

    updateIntensity(intensityH: number, intensityS: number, intensityV: number) {
        this.renderer?.updateIntensity(intensityH, intensityS, intensityV);
    }

    updateBackground(url: string) {
        if (url == '') {
            document.body.style.cssText = '';
        } else {
            document.body.style.background = `url("${url}")`;
            document.body.style.backgroundSize = 'contain';
            document.body.style.backgroundPosition = 'center';
        }
    }

    /**
     * attach user control listeners
     */
    private attachListeners() {
        document.querySelector<HTMLFormElement>('form')?.reset();
        const maskColorElement = document.querySelector<HTMLInputElement>('#mask_color');
        const maskColorTextElement = document.querySelector<HTMLInputElement>('#mask_color_text');
        maskColorElement?.addEventListener('change', () => {
            this.updateMaskColor(maskColorElement?.value || '#ffffff');
            maskColorTextElement!.value = maskColorElement.value;

        });
        maskColorTextElement?.addEventListener('change', () => {
            this.updateMaskColor(maskColorTextElement?.value || '#ffffff');
            maskColorElement!.value = maskColorTextElement.value;
        });

        const intensityElementH = document.querySelector<HTMLInputElement>('#intensity_h');
        const intensityElementS = document.querySelector<HTMLInputElement>('#intensity_s');
        const intensityElementV = document.querySelector<HTMLInputElement>('#intensity_v');
        const updateIntensity = () => {
            this.updateIntensity(
                parseInt(intensityElementH?.value || '20') / 100,
                parseInt(intensityElementS?.value || '70') / 100,
                parseInt(intensityElementV?.value || '80') / 100,
            );
        };
        intensityElementH?.addEventListener('change', updateIntensity);
        intensityElementS?.addEventListener('change', updateIntensity);
        intensityElementV?.addEventListener('change', updateIntensity);

        const backgroundImageElement = document.querySelector<HTMLInputElement>('#background_image');
        backgroundImageElement?.addEventListener('change', () => {
            this.updateBackground(backgroundImageElement.value);
        });

        window.addEventListener('resize', () => this.renderer?.updateDimension());
    }
}
