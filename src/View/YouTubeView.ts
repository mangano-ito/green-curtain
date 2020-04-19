export default class YouTubeView {
    private containerElement: HTMLElement;
    private iframeElement: HTMLIFrameElement;

    constructor() {
        const element = document.querySelector<HTMLElement>('#external_video');
        if (!element) {
            throw new Error('YouTube video view is required.');
        }
        this.containerElement = element;
        this.iframeElement = document.createElement('iframe');
        this.iframeElement.style.display = 'none';
        this.containerElement.appendChild(this.iframeElement);
    }

    show(id: string) {
        this.iframeElement.src = `https://www.youtube.com/embed/${id}`;
        this.iframeElement.style.display = '';
    }

    hide() {
        this.iframeElement.style.display = 'none';
    }
}
