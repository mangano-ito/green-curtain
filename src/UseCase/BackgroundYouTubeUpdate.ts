import YouTubeView from "#/View/YouTubeView";

/**
 * update background YouTube video
 */
export default class BackgroundYouTubeUpdate {
    /**
     * @param container YouTube view
     */
    constructor(private view: YouTubeView) {}

    /**
     * @param id ID of YouTube Video
     */
    invoke(id: string) {
        if (id === '') {
            this.view.hide();
            return;
        }
        this.view.show(id);
    }
}
