import domToImage from 'dom-to-image';

export default class PhotoTake {
    async invoke() {
        const uiElements = document.querySelectorAll<HTMLElement>('.ui');
        uiElements.forEach((el) => el.style.display = 'none');
        const url = await domToImage.toJpeg(document.body);
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.click();
        uiElements.forEach((el) => el.style.display = '');
    }
}
