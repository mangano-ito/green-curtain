export default class NoticeView {
    private noticeElement: HTMLElement;

    constructor(noticeElementQuery: string = '#notice') {
        const element = document.querySelector<HTMLElement>(noticeElementQuery);
        if (!element) {
            throw new Error('notice element is required.');
        }
        this.noticeElement = element;
    }

    show() {
        this.noticeElement.style.opacity = '';
    }

    hide() {
        this.noticeElement.style.opacity = '0';
    }
}
