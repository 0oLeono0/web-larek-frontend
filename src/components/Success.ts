import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Success extends Component<{ total: number }> {
	protected totalElement: HTMLParagraphElement;
	protected closeButton: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.totalElement = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this.closeButton.addEventListener('click', () => {
			this.events.emit('modal:close');
		});
	}

	setTotal(total: number) {
		this.totalElement.textContent = `Списано ${total} синапсов`;
	}

	getContainer(): HTMLElement {
		return this.container;
	}
}
