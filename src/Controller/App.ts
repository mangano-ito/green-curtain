import Renderer from '#/Delegates/Renderer';
import UserVideoStream from '#/Delegates/UserVideoStream';
import BackgroundYouTubeUpdate from '#/UseCase/BackgroundYouTubeUpdate';
import BackgroundImageUpdate from '#/UseCase/BackgroundImageUpdate';
import MaskColorControl from '#/View/MaskColorControl';
import IntensityControl from '#/View/IntensityControl';
import BackgroundImageControl from '#/View/BackgroundImageControl';

/**
 * green-curtain application controller
 */
export default class App {
    private video = new UserVideoStream();
    private renderer: Renderer | undefined;
    private canvasElement: HTMLCanvasElement;

    private maskColorControl: MaskColorControl;
    private intensityControl: IntensityControl;
    private backgroundImageControl: BackgroundImageControl;

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

        this.intensityControl = new IntensityControl();
        this.intensityControl.setOnIntensityUpdatedListener((intensityH: number, intensityS: number, intensityV) => this.renderer?.updateIntensity(intensityH, intensityS, intensityV));

        this.backgroundImageControl = new BackgroundImageControl();
        this.backgroundImageControl.setOnBackgroundImageUpdatedListener((url: string) => this.backgroundImageUpdate.invoke(url));

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

    /**
     * attach user control listeners
     */
    private attachListeners() {
        document.querySelector<HTMLFormElement>('form')?.reset();
        window.addEventListener('resize', () => this.renderer?.updateDimension());

        const backgroundYouTubeElement = document.querySelector<HTMLInputElement>('#background_youtube');
        backgroundYouTubeElement?.addEventListener('change', () => {
            const id = backgroundYouTubeElement.value;
            this.backgroundYouTubeUpdate.invoke(id);
        });
    }
}
