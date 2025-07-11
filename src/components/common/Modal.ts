import { IModalData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Modal<T extends IModalData> extends Component<T> {
	protected _content: HTMLElement;

	constructor(protected container: HTMLElement) {
		super(container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		const closeButton = ensureElement<HTMLElement>('.modal__close', container);
		closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener(
			'mousedown',
			this.handleBackgroundClick.bind(this)
		);
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keyup', this.handleEscUp);
	}

	close() {
		this.container.classList.remove('modal_active');
		document.removeEventListener('keyup', this.handleEscUp);
	}

	private handleEscUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	private handleBackgroundClick(evt: MouseEvent) {
		if (evt.target === this.container) {
			this.close();
		}
	}

	set modal(item: HTMLElement) {
		this._content.replaceChildren(item);
	}

	isOpen(): boolean {
		return this.container.classList.contains('modal_active');
	}
}
