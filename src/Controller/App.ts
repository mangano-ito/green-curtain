import Renderer from '#/Delegates/Renderer';
import UserVideoStream from '#/Delegates/UserVideoStream';
import BackgroundYouTubeUpdate from '#/UseCase/BackgroundYouTubeUpdate';
import BackgroundImageUpdate from '#/UseCase/BackgroundImageUpdate';
import MaskColorControl from '#/View/MaskColorControl';

/**
 * green-curtain application controller
 */
export default class App {
    private video = new UserVideoStream();
    private renderer: Renderer | undefined;
    private canvasElement: HTMLCanvasElement;

    private maskColorControl: MaskColorControl;

    private backgroundImageUpdate: BackgroundImageUpdate;
    private backgroundYouTubeUpdate: BackgroundYouTubeUpdate;

    /**
     * @param canvasQuery query for canvas element
     */
    constructor(canvasQuery: string) {
        const canvasElement = document.querySelector<HTMLCanvasElement>(canvasQuery);
        if (!canvasElement) {
            throw new Error('The Canvas is required.');
        }
        this.canvasElement = canvasElement;

        this.maskColorControl = new MaskColorControl();
        this.maskColorControl.setOnMaskColorUpdateListener((color: string) => this.renderer?.updateMaskColor(color));

        const externalVideoElement = document.querySelector<HTMLElement>('#external_video');
        if (!externalVideoElement) {
            throw new Error('#external_video is required.');
        }
        this.backgroundYouTubeUpdate = new BackgroundYouTubeUpdate(externalVideoElement);
        this.backgroundImageUpdate = new BackgroundImageUpdate();

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

    updateIntensity(intensityH: number, intensityS: number, intensityV: number) {
        this.renderer?.updateIntensity(intensityH, intensityS, intensityV);
    }

    /**
     * attach user control listeners
     */
    private attachListeners() {
        document.querySelector<HTMLFormElement>('form')?.reset();

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
        backgroundImageElement?.addEventListener('change', () => this.backgroundImageUpdate.invoke(backgroundImageElement.value));

        window.addEventListener('resize', () => this.renderer?.updateDimension());

        const backgroundYouTubeElement = document.querySelector<HTMLInputElement>('#background_youtube');
        backgroundYouTubeElement?.addEventListener('change', () => {
            const id = backgroundYouTubeElement.value;
            this.backgroundYouTubeUpdate.invoke(id);
        });
    }
}
