import domToImage from 'dom-to-image';
import PhotoTakeDialog from '#/View/PhotoTakeDialog';

export default class PhotoTake {
    constructor(private photoTakeDialog: PhotoTakeDialog) {}

    async invoke() {
        const uiElements = document.querySelectorAll<HTMLElement>('.ui');
        uiElements.forEach((el) => el.style.display = 'none');
        const url = await domToImage.toJpeg(document.body).catch(() => undefined);
        uiElements.forEach((el) => el.style.display = '');
        if (url) {
            this.photoTakeDialog.show(url);
        }
    }
}
