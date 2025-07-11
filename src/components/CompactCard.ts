import { ICard } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class CompactCard extends Component<ICard> {
	protected cardId: string;
	protected cardTitle: HTMLElement;
	protected cardPrice: HTMLSpanElement;
	protected _cardIndex: number;
	protected cardIndexElement: HTMLElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.cardTitle = ensureElement<HTMLElement>('.card__title', container);
		this.cardPrice = ensureElement<HTMLSpanElement>('.card__price', container);
		this.cardIndexElement = ensureElement<HTMLElement>(
			'.basket__item-index',
			container
		);
		const removeBtn = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);
		removeBtn.addEventListener('click', () => {
			this.events.emit('card:remove', { id: this.cardId });
		});
	}

	set id(id: string) {
		this.cardId = id;
	}

	get id(): string {
		return this.cardId;
	}

	set title(title: string) {
		this.cardTitle.textContent = title;
	}

	set price(price: number | null) {
		this.cardPrice.textContent =
			price === null ? '0 синапсов' : `${price} синапсов`;
	}

	set cardIndex(index: number) {
		this._cardIndex = index;
		this.cardIndexElement.textContent = String(index);
	}

	get cardIndex(): number {
		return this._cardIndex;
	}

	render(data: Partial<ICard>): HTMLElement {
		return super.render(data);
	}
}
