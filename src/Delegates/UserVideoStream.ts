/**
 * user video stream wrapper
 */
export default class UserVideoStream {
    private element: HTMLVideoElement;

    constructor() {
        const element: HTMLVideoElement = document.createElement('video');
        element.autoplay = true;
        element.muted = true;
        element.loop = true;

        // we must set the element visible. Chrome prohibits invisible video renders.
        element.style.width = '0';
        element.style.height = '0';
        document.body.appendChild(element);

        this.element = element;
    }

    /**
     * wait for video stream start and get the video element
     */
    async waitForVideoStreamElement(): Promise<HTMLVideoElement> {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.element.srcObject = stream;

        // wait for metadata complete so that we can obtain video dimension
        await new Promise((resolve) => { this.element.onloadedmetadata = () => resolve(); });

        return this.element;
    }
}
