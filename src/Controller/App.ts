import Renderer from '#/Delegates/Renderer';
import UserVideoStream from '#/Delegates/UserVideoStream';
import BackgroundYouTubeUpdate from '#/UseCase/BackgroundYouTubeUpdate';
import BackgroundImageUpdate from '#/UseCase/BackgroundImageUpdate';
import MaskColorControl from '#/View/MaskColorControl';
import IntensityControl from '#/View/IntensityControl';
import BackgroundImageControl from '#/View/BackgroundImageControl';
import BackgroundYouTubeControl from '#/View/BackgroundYouTubeControl';
import NoticeView from '#/View/NoticeView';
import YouTubeView from '#/View/YouTubeView';

/**
 * green-curtain application controller
 */
export default class App {
    private video = new UserVideoStream();
    private renderer: Renderer | undefined;
    private canvasElement: HTMLCanvasElement;

    private maskColorControl: MaskColorControl = new MaskColorControl();
    private intensityControl: IntensityControl = new IntensityControl();
    private backgroundImageControl: BackgroundImageControl = new BackgroundImageControl();
    private backgroundYouTubeControl: BackgroundYouTubeControl = new BackgroundYouTubeControl();
    private youTubeView: YouTubeView = new YouTubeView();
    private noticeView: NoticeView = new NoticeView();

    private backgroundImageUpdate: BackgroundImageUpdate = new BackgroundImageUpdate();
    private backgroundYouTubeUpdate: BackgroundYouTubeUpdate = new BackgroundYouTubeUpdate(this.youTubeView);

    /**
     * @param canvasQuery query for canvas element
     */
    constructor(canvasQuery: string) {
        const canvasElement = document.querySelector<HTMLCanvasElement>(canvasQuery);
        if (!canvasElement) {
            throw new Error('The Canvas is required.');
        }
        this.canvasElement = canvasElement;

        this.maskColorControl.setOnMaskColorUpdateListener((color: string) => this.renderer?.updateMaskColor(color));
        this.intensityControl.setOnIntensityUpdatedListener((intensityH: number, intensityS: number, intensityV) => this.renderer?.updateIntensity(intensityH, intensityS, intensityV));
        this.backgroundImageControl.setOnBackgroundImageUpdatedListener((url: string) => this.backgroundImageUpdate.invoke(url));
        this.backgroundYouTubeControl.setOnBackgroundYouTubeUpdatedListener((id: string) => this.backgroundYouTubeUpdate.invoke(id));

        document.querySelector<HTMLFormElement>('form')?.reset();
        window.addEventListener('resize', () => this.renderer?.updateDimension());
    }

    /**
     * run application
     */
    async run() {
        const videoElement = await this.video.waitForVideoStreamElement();
        this.noticeView.hide();
        this.renderer = new Renderer(this.canvasElement, videoElement);
        this.renderer.startRendering();
    }
}
