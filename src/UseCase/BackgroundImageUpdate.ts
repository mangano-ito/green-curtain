/**
 * update background image
 */
export default class BackgroundImageUpdate {
    /**
     * @param url URL of background image
     */
    invoke(url: string) {
        if (url == '') {
            document.body.style.cssText = '';
        } else {
            document.body.style.background = `url("${url}")`;
            document.body.style.backgroundSize = 'contain';
            document.body.style.backgroundPosition = 'center';
        }
    }
}
