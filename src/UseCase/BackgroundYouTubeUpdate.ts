/**
 * update background YouTube video
 */
export default class BackgroundYouTubeUpdate {
    /**
     * @param container video container element
     */
    constructor(private container: HTMLElement) {}

    /**
     * @param id ID of YouTube Video
     */
    invoke(id: string) {
        this.container.innerHTML = '';
        if (id === '') {
            return;
        }

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${id}`;
        this.container.appendChild(iframe);
    }
}
